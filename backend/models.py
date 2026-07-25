from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Client")

    # Сохраненные данные сканера железа (в JSON-строке или текстом)
    pc_os = Column(String, default="Не сканировалось")
    pc_gpu = Column(String, default="Не сканировалось")
    pc_cpu = Column(String, default="Не сканировалось")
    pc_ram = Column(String, default="Не сканировалось")

    orders = relationship("Order", back_populates="owner")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, index=True)  # "build", "gpu", "peripheral"
    price = Column(Float, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    specs = Column(String)  # Краткие характеристики


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    build_name = Column(String, nullable=False)
    status = Column(String, default="Идет стресс-тестирование")
    progress_percentage = Column(Integer, default=65)

    owner = relationship("User", back_populates="orders")