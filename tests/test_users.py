import pytest
from fastapi.testclient import TestClient


def test_get_users(client: TestClient):
    """Test getting all users."""
    response = client.get("/api/v1/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_users_with_pagination(client: TestClient):
    """Test getting users with pagination."""
    response = client.get("/api/v1/users/?skip=0&limit=5")
    assert response.status_code == 200
    users = response.json()
    assert len(users) <= 5


def test_get_user_by_id(client: TestClient):
    """Test getting user by ID."""
    # First, create a user via the API
    user_data = {
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "website": "johndoe.com",
        "address": {
            "street": "123 Main St",
            "suite": "Apt 1",
            "city": "Anytown",
            "zipcode": "12345",
            "geo": {
                "lat": "40.7128",
                "lng": "-74.0060"
            }
        },
        "company": {
            "name": "John's Company",
            "catchPhrase": "Making the world better",
            "bs": "innovative solutions"
        }
    }
    
    # Need auth headers for creating user
    auth_response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Admin",
            "email": "admin@example.com",
            "password": "admin123"
        }
    )
    token = auth_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create user
    create_response = client.post("/api/v1/users/", json=user_data, headers=headers)
    assert create_response.status_code == 200
    created_user = create_response.json()
    
    # Get user by ID
    response = client.get(f"/api/v1/users/{created_user['id']}")
    assert response.status_code == 200
    user = response.json()
    assert user["name"] == "John Doe"
    assert user["email"] == "john@example.com"


def test_get_nonexistent_user(client: TestClient):
    """Test getting non-existent user."""
    response = client.get("/api/v1/users/99999")
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


def test_create_user_without_auth(client: TestClient):
    """Test creating user without authentication."""
    user_data = {
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "website": "johndoe.com",
        "address": {
            "street": "123 Main St",
            "suite": "Apt 1",
            "city": "Anytown",
            "zipcode": "12345",
            "geo": {
                "lat": "40.7128",
                "lng": "-74.0060"
            }
        },
        "company": {
            "name": "John's Company",
            "catchPhrase": "Making the world better",
            "bs": "innovative solutions"
        }
    }
    
    response = client.post("/api/v1/users/", json=user_data)
    assert response.status_code == 401


def test_create_user_with_auth(client: TestClient, auth_headers):
    """Test creating user with authentication."""
    user_data = {
        "name": "Jane Doe",
        "username": "janedoe",
        "email": "jane@example.com",
        "phone": "098-765-4321",
        "website": "janedoe.com",
        "address": {
            "street": "456 Oak Ave",
            "suite": "Suite 2",
            "city": "Other City",
            "zipcode": "54321",
            "geo": {
                "lat": "34.0522",
                "lng": "-118.2437"
            }
        },
        "company": {
            "name": "Jane's Corp",
            "catchPhrase": "Innovation at its best",
            "bs": "cutting-edge technology"
        }
    }
    
    response = client.post("/api/v1/users/", json=user_data, headers=auth_headers)
    assert response.status_code == 200
    user = response.json()
    assert user["name"] == "Jane Doe"
    assert user["email"] == "jane@example.com"


def test_update_user(client: TestClient, auth_headers):
    """Test updating user."""
    # First create a user
    user_data = {
        "name": "Original Name",
        "username": "original",
        "email": "original@example.com",
        "phone": "111-111-1111",
        "website": "original.com",
        "address": {
            "street": "Original St",
            "suite": "Suite 1",
            "city": "Original City",
            "zipcode": "11111",
            "geo": {
                "lat": "0.0",
                "lng": "0.0"
            }
        },
        "company": {
            "name": "Original Corp",
            "catchPhrase": "Original phrase",
            "bs": "original business"
        }
    }
    
    create_response = client.post("/api/v1/users/", json=user_data, headers=auth_headers)
    user = create_response.json()
    
    # Update user
    update_data = {
        "name": "Updated Name",
        "email": "updated@example.com"
    }
    
    response = client.put(f"/api/v1/users/{user['id']}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["name"] == "Updated Name"
    assert updated_user["email"] == "updated@example.com"


def test_delete_user(client: TestClient, auth_headers):
    """Test deleting user."""
    # First create a user
    user_data = {
        "name": "To Delete",
        "username": "todelete",
        "email": "todelete@example.com",
        "phone": "222-222-2222",
        "website": "todelete.com",
        "address": {
            "street": "Delete St",
            "suite": "Suite 1",
            "city": "Delete City",
            "zipcode": "22222",
            "geo": {
                "lat": "1.0",
                "lng": "1.0"
            }
        },
        "company": {
            "name": "Delete Corp",
            "catchPhrase": "To be deleted",
            "bs": "temporary business"
        }
    }
    
    create_response = client.post("/api/v1/users/", json=user_data, headers=auth_headers)
    user = create_response.json()
    
    # Delete user
    response = client.delete(f"/api/v1/users/{user['id']}", headers=auth_headers)
    assert response.status_code == 200
    
    # Verify user is deleted
    get_response = client.get(f"/api/v1/users/{user['id']}")
    assert get_response.status_code == 404 