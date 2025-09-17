from fastapi import FastAPI

app = FastAPI()  # 👈 this must be named app

@app.get("/")
def home():
    return {"msg": "hello world"}
