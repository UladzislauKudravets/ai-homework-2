import json
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.user import Base, User, Address, Geo, Company, AuthUser
from app.core.security import get_password_hash


def init_db():
    """Initialize database with tables and seed data."""
    # Create engine and session
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already has data, skipping seed.")
            return
        
        # Load seed data
        seed_file = Path(__file__).parent.parent / "users_seed_data.json"
        if not seed_file.exists():
            print("Seed data file not found, creating sample data.")
            create_sample_data(db)
            return
            
        with open(seed_file, "r") as f:
            users_data = json.load(f)
        
        # Seed users from JSONPlaceholder data
        for user_data in users_data:
            # Create user
            db_user = User(
                id=user_data["id"],
                name=user_data["name"],
                username=user_data["username"],
                email=user_data["email"],
                phone=user_data["phone"],
                website=user_data["website"],
            )
            db.add(db_user)
            db.flush()
            
            # Create address
            address_data = user_data["address"]
            db_address = Address(
                street=address_data["street"],
                suite=address_data["suite"],
                city=address_data["city"],
                zipcode=address_data["zipcode"],
                user_id=db_user.id,
            )
            db.add(db_address)
            db.flush()
            
            # Create geo
            geo_data = address_data["geo"]
            db_geo = Geo(
                lat=geo_data["lat"],
                lng=geo_data["lng"],
                address_id=db_address.id,
            )
            db.add(db_geo)
            
            # Create company
            company_data = user_data["company"]
            db_company = Company(
                name=company_data["name"],
                catchPhrase=company_data["catchPhrase"],
                bs=company_data["bs"],
                user_id=db_user.id,
            )
            db.add(db_company)
        
        # Create default auth user
        default_auth_user = AuthUser(
            name="Admin User",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
        )
        db.add(default_auth_user)
        
        db.commit()
        print(f"Database initialized with {len(users_data)} users.")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


def create_sample_data(db):
    """Create sample data if seed file is not available."""
    sample_users = [
        {
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "leanne@example.com",
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {"lat": "-37.3159", "lng": "81.1496"}
            },
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            }
        }
    ]
    
    for i, user_data in enumerate(sample_users, 1):
        # Create user
        db_user = User(
            id=i,
            name=user_data["name"],
            username=user_data["username"],
            email=user_data["email"],
            phone=user_data["phone"],
            website=user_data["website"],
        )
        db.add(db_user)
        db.flush()
        
        # Create address
        address_data = user_data["address"]
        db_address = Address(
            street=address_data["street"],
            suite=address_data["suite"],
            city=address_data["city"],
            zipcode=address_data["zipcode"],
            user_id=db_user.id,
        )
        db.add(db_address)
        db.flush()
        
        # Create geo
        geo_data = address_data["geo"]
        db_geo = Geo(
            lat=geo_data["lat"],
            lng=geo_data["lng"],
            address_id=db_address.id,
        )
        db.add(db_geo)
        
        # Create company
        company_data = user_data["company"]
        db_company = Company(
            name=company_data["name"],
            catchPhrase=company_data["catchPhrase"],
            bs=company_data["bs"],
            user_id=db_user.id,
        )
        db.add(db_company)
    
    # Create default auth user
    default_auth_user = AuthUser(
        name="Admin User",
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
    )
    db.add(default_auth_user)
    
    db.commit()
    print("Database initialized with sample data.")


if __name__ == "__main__":
    init_db() 