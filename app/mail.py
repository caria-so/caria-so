"""Outbound mail for contact forms — SMTP via environment variables."""

import os
import smtplib
from email.message import EmailMessage


class MailConfigError(Exception):
    """SMTP is not configured."""


class MailDeliveryError(Exception):
    """SMTP send failed."""


def _smtp_config():
    host = os.environ.get('SMTP_HOST', '').strip()
    user = os.environ.get('SMTP_USER', '').strip()
    password = (
        os.environ.get('SMTP_PASSWORD', '')
        or os.environ.get('SMTP_PASS', '')
    ).strip()

    if not host or not user or not password:
        raise MailConfigError(
            'Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD before accepting contact submissions.'
        )

    from_addr = os.environ.get('MAIL_FROM', '').strip() or user
    use_tls = os.environ.get('SMTP_USE_TLS', 'true').lower() not in ('0', 'false', 'no')

    return {
        'host': host,
        'port': int(os.environ.get('SMTP_PORT', '587')),
        'user': user,
        'password': password,
        'from_addr': from_addr,
        'use_tls': use_tls,
    }


def is_mail_configured():
    try:
        _smtp_config()
        return True
    except MailConfigError:
        return False


def send_contact_email(*, to, reply_to, subject, body):
    """Send a plain-text contact notification. Sets Reply-To to the submitter."""
    cfg = _smtp_config()

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = cfg['from_addr']
    msg['To'] = to
    msg['Reply-To'] = reply_to
    msg.set_content(body)

    try:
        with smtplib.SMTP(cfg['host'], cfg['port'], timeout=30) as smtp:
            if cfg['use_tls']:
                smtp.starttls()
            smtp.login(cfg['user'], cfg['password'])
            smtp.send_message(msg)
    except smtplib.SMTPException as exc:
        raise MailDeliveryError(str(exc)) from exc
