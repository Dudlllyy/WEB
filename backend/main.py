from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Monochrome Glass API", version="1.0.0")

# Настройка CORS (чтобы локальный HTML мог делать запросы к серверу)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем любые источники для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- АВТОМАТИЧЕСКОЕ ЗАПОЛНЕНИЕ ТЕСТОВЫМИ ТОВАРАМИ ПРИ СТАРТЕ ---
@app.on_event("startup")
def seed_db():
    db = next(get_db())
    if db.query(models.Product).count() == 0:
        sample_products = [
            models.Product(
                title="RTX 4090",
                category="gpu",
                price=1599.00,
                description="Флагманская видеокарта с невероятной мощностью. Оснащена новейшей системой охлаждения и трассировкой лучей.",
                image_url="RTX_4090.png" # Имена твоих картинок
            ),
            models.Product(
                title="Intel i9",
                category="cpu",
                price=599.00,
                description="Высокопроизводительный процессор для любых рабочих задач и киберспорта.",
                image_url="Intel_i9.png"
            ),
            models.Product(
                title="Fury RAM",
                category="ram",
                price=199.00,
                description="Быстрая оперативная память стандарта DDR5.",
                image_url="Fyru_RAM.png"
            ),
            models.Product(
                title="Z790 Board",
                category="motherboard",
                price=499.00,
                description="Материнская плата премиум-класса для оверклокинга. Поддержка PCIe 5.0 и Wi-Fi 6E.",
                image_url="Mother_board.png"
            ),
            models.Product(
                title="Crucial M.2",
                category="storage",
                price=150.00,
                description="Сверхбыстрый SSD накопитель на 2 ТБ.",
                image_url="SSD_m2.png"
            ),
            models.Product(
                title="RX 7900",
                category="gpu",
                price=999.00,
                description="Мощный конкурент от AMD. Идеально для 4K гейминга без компромиссов.",
                image_url="videocard.png"
            )
        ]
        db.add_all(sample_products)
        db.commit()


# ================= АВТОРИЗАЦИЯ =================
@app.post("/api/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # При регистрации сразу создаем приветственный тестовый заказ в личном кабинете
    demo_order = models.Order(user_id=new_user.id, build_name="Custom Build #1", status="Идет стресс-тестирование",
                              progress_percentage=65)
    db.add(demo_order)
    db.commit()

    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # В OAuth2 форме логин передается в поле username (в нашем случае мы вбиваем туда email)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный Email или пароль")

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# ================= ПРОФИЛЬ (КАБИНЕТ) =================
@app.get("/api/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.post("/api/users/me/specs")
def update_pc_specs(specs: schemas.PCSpecsUpdate, current_user: models.User = Depends(auth.get_current_user),
                    db: Session = Depends(get_db)):
    current_user.pc_os = specs.os
    current_user.pc_gpu = specs.gpu
    current_user.pc_cpu = specs.cpu
    current_user.pc_ram = specs.ram
    db.commit()
    return {"status": "success", "message": "Характеристики ПК успешно сохранены в базе данных!"}


# ================= КАТАЛОГ ТОВАРОВ =================
@app.get("/api/products", response_model=List[schemas.ProductOut])
def get_products(category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.all()