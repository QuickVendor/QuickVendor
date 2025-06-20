import jwt
import logging

logger = logging.getLogger(__name__)


def decode_supabase_jwt(token):
    """
    Decode Supabase JWT token.
    
    Args:
        token (str): JWT token string
        
    Returns:
        dict or None: Decoded payload if valid, None if invalid
    """
    if not token:
        return None
        
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
            
        # TODO: Replace with actual Supabase public key
        # For now, using placeholder secret - will be updated when Supabase is integrated
        secret = 'placeholder-secret-key'
        
        # Decode JWT token
        payload = jwt.decode(
            token, 
            secret, 
            algorithms=['RS256'],
            options={'verify_signature': False}  # Disabled for MVP, enable with real key
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        return None
        
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {str(e)}")
        return None
        
    except Exception as e:
        logger.error(f"Unexpected error decoding JWT: {str(e)}")
        return None