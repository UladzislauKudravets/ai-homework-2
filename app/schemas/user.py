from typing import Optional
from pydantic import BaseModel, EmailStr


class GeoBase(BaseModel):
    """Base schema for geographic coordinates."""
    lat: str
    lng: str


class GeoCreate(GeoBase):
    """Schema for creating geographic coordinates."""
    pass


class Geo(GeoBase):
    """Schema for geographic coordinates response."""
    id: int

    class Config:
        orm_mode = True


class AddressBase(BaseModel):
    """Base schema for address."""
    street: str
    suite: str
    city: str
    zipcode: str


class AddressCreate(AddressBase):
    """Schema for creating address."""
    geo: GeoCreate


class Address(AddressBase):
    """Schema for address response."""
    id: int
    geo: Geo

    class Config:
        orm_mode = True


class CompanyBase(BaseModel):
    """Base schema for company."""
    name: str
    catchPhrase: str
    bs: str


class CompanyCreate(CompanyBase):
    """Schema for creating company."""
    pass


class Company(CompanyBase):
    """Schema for company response."""
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    """Base schema for user."""
    name: str
    username: str
    email: EmailStr
    phone: str
    website: str


class UserCreate(UserBase):
    """Schema for creating user."""
    address: AddressCreate
    company: CompanyCreate


class UserUpdate(BaseModel):
    """Schema for updating user."""
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class User(UserBase):
    """Schema for user response."""
    id: int
    address: Address
    company: Company

    class Config:
        orm_mode = True


class AuthUserCreate(BaseModel):
    """Schema for creating auth user."""
    name: str
    email: EmailStr
    password: str


class AuthUserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for token data."""
    email: Optional[str] = None 