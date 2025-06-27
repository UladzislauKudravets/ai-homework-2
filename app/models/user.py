from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    """User model matching JSONPlaceholder structure."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    website = Column(String)

    # Relationships
    address = relationship("Address", back_populates="user", uselist=False)
    company = relationship("Company", back_populates="user", uselist=False)


class Address(Base):
    """Address model for users."""
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    street = Column(String)
    suite = Column(String)
    city = Column(String)
    zipcode = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="address")
    geo = relationship("Geo", back_populates="address", uselist=False)


class Geo(Base):
    """Geographic coordinates for addresses."""
    __tablename__ = "geo"

    id = Column(Integer, primary_key=True, index=True)
    lat = Column(String)
    lng = Column(String)
    address_id = Column(Integer, ForeignKey("addresses.id"))

    # Relationships
    address = relationship("Address", back_populates="geo")


class Company(Base):
    """Company model for users."""
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    catchPhrase = Column(String)
    bs = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="company")


class AuthUser(Base):
    """Authentication user model for login."""
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String) 