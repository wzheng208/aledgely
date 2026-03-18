from app import create_app

app = create_app()

if __name__ == "__main__":
    print("Starting server...")  # 👈 add this
    app.run(debug=True)