from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- Схемы для Товаров ---
class ProductOut(BaseModel):
    id: int
    title: str
    category: str
    price: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    specs: Optional[str] = None

    class Config:
        from_attributes = True

# --- Схемы для Заказов ---
class OrderOut(BaseModel):
    id: int
    build_name: str
    status: str
    progress_percentage: int

    class Config:
        from_attributes = True

# --- Схемы для Пользователей и Авторизации ---
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class PCSpecsUpdate(BaseModel):
    os: str
    gpu: str
    cpu: str
    ram: str

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    role: str
    pc_os: str
    pc_gpu: str
    pc_cpu: str
    pc_ram: str
    orders: List[OrderOut] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str