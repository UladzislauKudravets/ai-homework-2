from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.user import User, Address, Geo, Company, AuthUser
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username."""
    return db.query(User).filter(User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get list of users with pagination."""
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    """Create new user with address and company."""
    # Create user
    db_user = User(
        name=user.name,
        username=user.username,
        email=user.email,
        phone=user.phone,
        website=user.website,
    )
    db.add(db_user)
    db.flush()  # Get the user ID
    
    # Create address
    db_address = Address(
        street=user.address.street,
        suite=user.address.suite,
        city=user.address.city,
        zipcode=user.address.zipcode,
        user_id=db_user.id,
    )
    db.add(db_address)
    db.flush()  # Get the address ID
    
    # Create geo
    db_geo = Geo(
        lat=user.address.geo.lat,
        lng=user.address.geo.lng,
        address_id=db_address.id,
    )
    db.add(db_geo)
    
    # Create company
    db_company = Company(
        name=user.company.name,
        catchPhrase=user.company.catchPhrase,
        bs=user.company.bs,
        user_id=db_user.id,
    )
    db.add(db_company)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Update user."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> Optional[User]:
    """Delete user."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


# Auth user CRUD operations
def get_auth_user_by_email(db: Session, email: str) -> Optional[AuthUser]:
    """Get auth user by email."""
    return db.query(AuthUser).filter(AuthUser.email == email).first()


def create_auth_user(db: Session, name: str, email: str, password: str) -> AuthUser:
    """Create auth user with hashed password."""
    hashed_password = get_password_hash(password)
    db_user = AuthUser(name=name, email=email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[AuthUser]:
    """Authenticate user by email and password."""
    user = get_auth_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user 