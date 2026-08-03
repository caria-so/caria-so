// Scientific UX Network Graph Visualization using D3.js
class UXNetworkGraph {
    constructor(containerId, owlData) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        console.log('Container found:', this.container);
        
        this.owlData = owlData;
        this.width = 800; // Will be updated in setupContainer
        this.height = 600;
        
        // Colors for different node types - scientific/clean palette
        this.colors = {
            UserAction: '#4285f4',      // Blue
            Outcome: '#34a853',         // Green  
            Cause: '#fbbc05',           // Yellow
            Effect: '#ea4335',          // Red
            Solution: '#9c27b0',        // Purple
            UIComponent: '#00bcd4',     // Cyan
            PageType: '#795548',        // Brown
            Process: '#ff5722',         // Deep Orange
            Decision: '#607d8b'         // Blue Grey
        };
        
        this.nodes = [];
        this.links = [];
        
        this.init();
    }
    
    init() {
        this.setupContainer();
        this.parseOWLData();
        this.setupD3();
        this.setupSimulation();
        this.render();
        this.setupInteractions();
        
        window.addEventListener('resize', () => this.handleResize());
        
        // Listen for theme changes
        this.setupThemeListener();
    }
    
    setupContainer() {
        // Clear container and set up as full screen section
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100vw';
        this.container.style.height = '550px';
        this.container.style.backgroundColor = 'var(--c-background)';
        this.container.style.margin = '0';
        this.container.style.padding = '0';
        this.container.style.overflow = 'hidden';
        
        // Make parent section full screen too
        const parentSection = this.container.closest('section');
        if (parentSection) {
            parentSection.style.margin = '0';
            parentSection.style.padding = '0';
            parentSection.style.width = '100vw';
            parentSection.style.position = 'relative';
            parentSection.style.left = '50%';
            parentSection.style.right = '50%';
            parentSection.style.marginLeft = '-50vw';
            parentSection.style.marginRight = '-50vw';
        }
        
        // Update dimensions
        this.width = window.innerWidth;
        this.height = 550;
        
        // Add service breakdown card
        this.createServiceCard();
    }
    
    createServiceCard() {
        const card = document.createElement('div');
        card.id = 'service-breakdown-card';
        card.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            width: 400px;
            max-height: 450px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            z-index: 10;
            overflow-y: auto;
            font-size: 14px;
        `;
        
        // Add dark theme glass effect
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            card.style.background = 'rgba(0, 0, 0, 0.3)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Create carousel container
        card.innerHTML = `<div id="ux-service-carousel"></div>`;
        
        this.container.appendChild(card);
        
        // Initialize carousel after card is added to DOM
        setTimeout(() => {
            if (window.UXServiceCarousel) {
                new UXServiceCarousel('ux-service-carousel');
            } else {
                console.error('UXServiceCarousel not found');
                // Fallback content
                document.getElementById('ux-service-carousel').innerHTML = `
                    <div class="card-badge flex horizontal gap-s aligncenter mb-m">
                        <div class="card-badge-dot dot-pulse" style="background-color: #667eea; animation-delay: 0.3s;"></div>
                        <div class="card-badge-text txt-mono txt-light uppercase txt-xsmall">UX & Product Strategy</div>
                    </div>
                    <h2 class="txt-bold" style="margin: 0 0 16px 0; color: var(--c-text-primary)">UX Uncovered</h2>
                    <h4 class="txt-light mb-m">Combining Academic Rigor with AI</h4>
                    <p class="txt-light mb-m">
                        I can consult on every aspect of the UX process, from research to design to development.
                    </p>
                `;
            }
        }, 200);
    }
    
    parseOWLData() {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.owlData, "text/xml");
        
        const individuals = xmlDoc.querySelectorAll('owl\\:NamedIndividual, NamedIndividual');
        const nodeMap = new Map();
        
        individuals.forEach((individual, idx) => {
            const about = individual.getAttribute('rdf:about');
            if (!about) return;
            
            const id = about.split('#')[1];
            if (!id) return;
            
            // Get type
            const typeEl = individual.querySelector('rdf\\:type, type');
            let type = 'Unknown';
            if (typeEl) {
                const resource = typeEl.getAttribute('rdf:resource');
                if (resource) {
                    type = resource.split('#')[1];
                }
            }
            
            // Get label
            const labelEl = individual.querySelector('rdfs\\:label, label');
            const label = labelEl ? labelEl.textContent : id;
            
            const node = {
                id: id,
                label: label.length > 30 ? label.substring(0, 30) + '...' : label,
                fullLabel: label,
                type: type,
                color: this.colors[type] || '#757575',
                size: Math.random() * 4 + 8
            };
            
            this.nodes.push(node);
            nodeMap.set(id, node);
        });
        
        // Also extract relationships from within NamedIndividuals
        individuals.forEach(individual => {
            const about = individual.getAttribute('rdf:about');
            if (!about) return;
            
            const sourceId = about.split('#')[1];
            const sourceNode = nodeMap.get(sourceId);
            if (!sourceNode) return;
            
            // Look for property elements within individuals
            Array.from(individual.children).forEach(child => {
                const resource = child.getAttribute('rdf:resource');
                if (!resource || child.tagName.includes('type') || child.tagName.includes('label')) return;
                
                const targetId = resource.split('#')[1];
                const targetNode = nodeMap.get(targetId);
                
                if (targetNode && sourceNode !== targetNode) {
                    const relType = child.tagName.includes(':') ? 
                        child.tagName.split(':')[1] : child.tagName;
                    
                    this.links.push({
                        source: sourceNode.id,
                        target: targetNode.id,
                        type: relType,
                        color: this.getRelationshipColor(relType)
                    });
                }
            });
        });
        
        // Extract relationships
        const descriptions = xmlDoc.querySelectorAll('rdf\\:Description, Description');
        descriptions.forEach(desc => {
            const about = desc.getAttribute('rdf:about');
            if (!about) return;
            
            const sourceId = about.split('#')[1];
            const sourceNode = nodeMap.get(sourceId);
            if (!sourceNode) return;
            
            Array.from(desc.children).forEach(child => {
                const resource = child.getAttribute('rdf:resource');
                if (!resource) return;
                
                const targetId = resource.split('#')[1];
                const targetNode = nodeMap.get(targetId);
                
                if (targetNode && sourceNode !== targetNode) {
                    const relType = child.tagName.includes('.') ? 
                        child.tagName.split('.')[1] : 
                        (child.tagName.split(':')[1] || child.tagName);
                    
                    this.links.push({
                        source: sourceNode.id,
                        target: targetNode.id,
                        type: relType,
                        color: this.getRelationshipColor(relType)
                    });
                }
            });
        });
        
        // Remove duplicates and limit for performance
        const linkSet = new Set();
        this.links = this.links.filter(link => {
            const key = `${link.source}-${link.target}-${link.type}`;
            if (linkSet.has(key)) return false;
            linkSet.add(key);
            return true;
        });
        
        // Limit nodes but keep diversity
        const nodesByType = {};
        this.nodes.forEach(node => {
            if (!nodesByType[node.type]) nodesByType[node.type] = [];
            nodesByType[node.type].push(node);
        });
        
        this.nodes = [];
        Object.keys(nodesByType).forEach(type => {
            this.nodes.push(...nodesByType[type].slice(0, 15)); // Max 15 per type
        });
        
        // Filter links to only include nodes we kept
        this.links = this.links.filter(link => 
            this.nodes.find(n => n.id === link.source) && 
            this.nodes.find(n => n.id === link.target)
        );
        
        console.log(`Loaded ${this.nodes.length} nodes and ${this.links.length} links`);
        // this.updateLegend(); // Removed since we're using carousel now
    }
    
    getRelationshipColor(relType) {
        const colorMap = {
            'foundOnPage': '#cccccc',
            'LEADS_TO': '#4CAF50',
            'CAUSES': '#FF9800', 
            'IMPACTS': '#F44336',
            'hasCatalogTheme': '#9C27B0'
        };
        return colorMap[relType] || '#dddddd';
    }
    
    updateLegend() {
        const legendContainer = document.getElementById('legend-container');
        const types = [...new Set(this.nodes.map(n => n.type))];
        
        legendContainer.innerHTML = types.map(type => `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${this.colors[type] || '#757575'}; margin-right: 8px;"></div>
                <span style="font-size: 12px; color: var(--c-text-secondary);">${type}</span>
            </div>
        `).join('');
    }
    
    setupD3() {
        // Use D3 for better force simulation
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .style('background-color', 'var(--c-background)');
            
        // Add zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
            
        this.svg.call(this.zoom);
        
        // Main group for all elements
        this.g = this.svg.append('g');
        
        // Add background that respects theme
        this.backgroundRect = this.svg.insert('rect', ':first-child')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', 'var(--c-background)');
    }
    
    setupSimulation() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => d.size + 5));
    }
    
    render() {
        // Links
        this.linkElements = this.g.selectAll('.link')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', d => d.color || '#999999')
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.4)
            .style('stroke-dasharray', d => {
                if (d.type === 'foundOnPage') return '5,5';
                if (d.type === 'LEADS_TO') return '3,3';
                return 'none';
            });
        
        // Nodes
        this.nodeElements = this.g.selectAll('.node')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', (event, d) => this.dragStart(event, d))
                .on('drag', (event, d) => this.dragging(event, d))
                .on('end', (event, d) => this.dragEnd(event, d)));
        
        // Node circles
        this.nodeElements.append('circle')
            .attr('r', d => d.size)
            .attr('fill', d => d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
        
        // Node labels
        this.nodeElements.append('text')
            .text(d => d.label)
            .attr('font-size', 10)
            .attr('font-family', 'var(--font-family)')
            .attr('fill', 'var(--c-text-primary)')
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.size + 15)
            .style('pointer-events', 'none');
        
        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            this.linkElements
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            this.nodeElements
                .attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
    }
    
    setupInteractions() {
        // Node hover effects
        this.nodeElements
            .on('mouseover', (event, d) => {
                // Highlight connected links
                this.linkElements
                    .attr('stroke-opacity', l => 
                        l.source.id === d.id || l.target.id === d.id ? 1 : 0.1)
                    .attr('stroke-width', l => 
                        l.source.id === d.id || l.target.id === d.id ? 3 : 1);
                
                // Show tooltip
                this.showTooltip(event, d);
            })
            .on('mouseout', () => {
                // Reset links
                this.linkElements
                    .attr('stroke-opacity', 0.6)
                    .attr('stroke-width', 1);
                
                // Hide tooltip
                this.hideTooltip();
            });
    }
    
    showTooltip(event, d) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'network-tooltip')
            .style('position', 'absolute')
            .style('background', 'var(--c-background)')
            .style('border', '1px solid var(--c-border)')
            .style('border-radius', '8px')
            .style('padding', '12px')
            .style('font-size', '12px')
            .style('color', 'var(--c-text-primary)')
            .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)')
            .style('z-index', '1000')
            .style('opacity', 0);
        
        tooltip.html(`
            <div style="font-weight: 600; margin-bottom: 4px;">${d.fullLabel}</div>
            <div style="color: var(--c-text-secondary);">Type: ${d.type}</div>
        `);
        
        tooltip.transition()
            .duration(200)
            .style('opacity', 1);
        
        tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }
    
    hideTooltip() {
        d3.selectAll('.network-tooltip').remove();
    }
    
    dragStart(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragging(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragEnd(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    handleResize() {
        this.width = window.innerWidth;
        this.height = 550;
        
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.simulation
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .restart();
    }
    
    setupThemeListener() {
        // Watch for theme changes
        const observer = new MutationObserver(() => {
            this.updateTheme();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    updateTheme() {
        // Force repaint - CSS variables should update automatically
        // but we can trigger a refresh if needed
        if (this.nodeElements) {
            this.nodeElements.selectAll('text')
                .attr('fill', 'var(--c-text-primary)');
        }
        
        if (this.backgroundRect) {
            this.backgroundRect.attr('fill', 'var(--c-background)');
        }
    }
}

// Load D3.js and initialize
function loadD3AndInitialize() {
    if (typeof d3 === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://d3js.org/d3.v7.min.js';
        script.onload = initializeGraph;
        document.head.appendChild(script);
    } else {
        initializeGraph();
    }
}

async function initializeGraph() {
    try {
        console.log('Initializing graph...');
        const response = await fetch('/static/js/datasets/ux_exploration.owl');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const owlData = await response.text();
        console.log('OWL data loaded, length:', owlData.length);
        new UXNetworkGraph('ux-exploration_owl', owlData);
    } catch (error) {
        console.error('Failed to load UX ontology:', error);
        // Create fallback with dummy data
        createFallbackVisualization();
    }
}

function createFallbackVisualization() {
    console.log('Creating fallback visualization...');
    const dummyData = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:owl="http://www.w3.org/2002/07/owl#"
         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">
    <owl:NamedIndividual rdf:about="#UserAction1">
        <rdf:type rdf:resource="#UserAction"/>
        <rdfs:label>Click Button</rdfs:label>
    </owl:NamedIndividual>
    <owl:NamedIndividual rdf:about="#Outcome1">
        <rdf:type rdf:resource="#Outcome"/>
        <rdfs:label>Page Load</rdfs:label>
    </owl:NamedIndividual>
    <owl:NamedIndividual rdf:about="#Process1">
        <rdf:type rdf:resource="#Process"/>
        <rdfs:label>Data Processing</rdfs:label>
    </owl:NamedIndividual>
    <rdf:Description rdf:about="#UserAction1">
        <leadsto rdf:resource="#Outcome1"/>
    </rdf:Description>
    <rdf:Description rdf:about="#Outcome1">
        <triggers rdf:resource="#Process1"/>
    </rdf:Description>
</rdf:RDF>`;
    new UXNetworkGraph('ux-exploration_owl', dummyData);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    loadD3AndInitialize();
});