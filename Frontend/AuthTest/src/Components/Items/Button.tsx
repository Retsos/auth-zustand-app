import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function OutlinedButtons() {

      const navigate = useNavigate();

    return (
        <Stack direction="row" spacing={2}>
            <Button variant="outlined"
                sx={{
                    color: '#fff',
                    borderColor: '#1e3a8a',
                    '&:hover': {
                        backgroundColor: '#1e40af',
                        borderColor: '#1e40af',
                    },
                }}
                onClick={() => navigate('/login')}
                >Login
            </Button>
        </Stack>
    );
}