# Full-Stack Auth App

**Backend**: Django REST Framework + Knox tokens  
**Frontend**: React + Zustand + React Router + MUI 

1. **Χτίσιμο Virtualenv**  
   ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # ή venv\Scripts\activate σε Windows
    
    pip install -r requirements.txt
   
    python manage.py migrate
    python manage.py createsuperuser

    python manage.py runserver

Frontend Setup (React)

    cd frontend
    npm install
    npm run dev 
