---
title: "The Basic of a Good Product list"
thread: ux
keywords: [product list, ecommerce UX, usability, WooCommerce]
author: "Federico Caria"
date: "2025-04-17"
tags: 
summary: "Questo è un demo creato per dimostrare le basi di una buona lista prodotti."
image: "/static/assets/images/monsieur_lib/monsieur_lib_bkg.png"
---

###### Introduction
An ineractive demo to experience how a mvp ecommerce product list should work. Don't be too formal: the UI isn't exactly dribble-ready, but... aren't we talking UX here?

Download on [GitHub]() | Or play [here](https://caria-io-productlist.onrender.com/). 

### 1. Some Context
There was that book by [Steve Krug](https://sensible.com/) called [Don't Make Me Think](https://sensible.com/dont-make-me-think/). I think the title is brilliant because it captures the equivalence of **Usability** → **Ease** → **Common Sense**, which, in my view, defines most commercial products (and beyond). You know, the kind of [usability Grandpa Jakob theorized](https://www.nngroup.com/articles/usability-101-introduction-to-usability/)—the merciless kind.

#### 1.1. In Defense of Instinct
Let’s put it this way: there’s a fundamental layer to human processing that’s always there, very simple—let’s call it instinctual, to tie back to the title. Without it, interaction breaks down. No matter how well functions are automated and orchestrated, no matter how brilliantly they flow from general to sophisticated depending on the target, if there’s no basic support for the part of human nature that’s most relevant to the task, the product just sucks.

#### 1.2. Unapology of Thought
*Don’t make me think*.. Isn’t that great? In a universe where 95% of <i>physical matter<i> is completely unknown, 99.9% of epistemology relies on approximations about the 1% of that 5% we can actually make statements about, and where 99.9% of the heuristics we use in that 1% are likey flawed, following Krug is way more practical than listening to everyone else telling us that *thinking is good*. Think? You have to reason? **No—just give me a product list that works!**

### 2. Basics Features Make Users Happy
In 15 years of careers I have learned that the bare minimum make customers happy. Things might get more complex later, but for now, let’s stick to the basics—enough to support essential behaviors like comparison without overcomplicating with advanced heuristics or context.

- **Breadcrumbs**: Let users know where they are and how they got there. Breadcrumbs provide context, make navigation easier, and clarify category relationships.

- **Product List Title**: Every list needs a clear, consistent title, placed below breadcrumbs. Inject it via API to avoid inconsistent naming and improve SEO.

- **Number of Products**: Always show how many items are in the list. Place it above or below the list, e.g., “347 items.”

- **Filtering Tool**: Essential for medium to large catalogs. Include at least five filters: brand, size, color, price, and user ratings. Desktop: sidebar; mobile: off-canvas toggle.

- **Sorting Tool**: Let users order items by relevance (default), price, rating, newest, etc.

- **List Entries**: Each product must include an image, name, and price. Display as a grid or list depending on product type and comparison needs.

- **Pagination**: Desktop: 50–100 items; mobile: 25–50. “Load more” is preferred; traditional pagination works. Avoid infinite scrolling.


### 3. Behavior Makes Users Feel at Home



### 4.What is Missing
I said above not to formalize you, it's just a demo made on the fly with the aim of testing once again the state of my turbulent relationship with React and having you interact with a list that behaves like a good girl.

**Filtering: Number of products does not update**

**Filters do not grey**

Download on [GitHub]() | Or play [here](https://caria-io-productlist.onrender.com/). 