// src/Components/AuthForm.tsx

import { useState, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import LockIcon from '@mui/icons-material/Lock'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'

import api from '../../api'            // Το axios instance σου
import { useAuthStore } from '../../Store' // Το Zustand auth store

type FormValues = {
    username?: string
    email?: string
    password1: string
    password2?: string
}

export default function Form() {
    const [isLogin, setIsLogin] = useState(true)
    const navigate = useNavigate()

    // Aπό το Zustand store:
    // - token: αν υπάρχει, redirect αυτόματα (είναι logged in)
    // - isLoading: αν τρέχει login ή register 
    // - error: μήνυμα σφάλματος από login
    // - login: συνάρτηση για login
    // - clearError: ξεκαθαρίζει το error στο store όταν αλλάζει η φόρμα
    const { token, isLoading, error, login, clearError } = useAuthStore()

    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<FormValues>({ mode: 'onSubmit' })

    // Αν ο χρήστης έχει ήδη token ->  LandingPage
    useEffect(() => {
        if (token) {
            navigate('/LandingPage')
        }
    }, [token, navigate])

    // Κάθε φορά που αλλάζει login<->register:
    // -  reset τα πεδία
    useEffect(() => {
        reset()
        clearErrors()
        clearError()
    }, [isLogin, reset, clearErrors, clearError])

    const passwordValue = watch('password1', '')

    const onSubmit: SubmitHandler<FormValues> = async data => {
        if (isLogin) {

            await login(data.email!, data.password1)

        } else {
            try {
                await api.post('/register/', {
                    username: data.username!,
                    email: data.email!,
                    password: data.password1,
                })
                // Αν επιτυχής registration, κάνουμε switch στη φόρμα login
                setIsLogin(true)
                reset()
            } catch (err: any) {
                const dataErrors = err.response?.data
                if (dataErrors?.username) {
                    setError('username', {
                        type: 'server',
                        message: (dataErrors.username as string[]).join(' '),
                    })
                }
                if (dataErrors?.email) {
                    setError('email', {
                        type: 'server',
                        message: (dataErrors.email as string[]).join(' '),
                    })
                }
                if (dataErrors?.password) {
                    setError('password1', {
                        type: 'server',
                        message: (dataErrors.password as string[]).join(' '),
                    })
                }
            }
        }
    }

    return (
        <Box
            component="form"
            key={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                width: '100%',
                maxWidth: { xs: '90%', sm: 360, md: 400 },
                mt: { xs: 2, sm: 8 },
                p: { xs: 2, sm: 3 },
                bgcolor: 'rgba(255, 255, 255)',
                backdropFilter: 'blur(10px)',
                boxShadow: 3,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2 },
            }}
        >
            <Typography variant="h5" align="center" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                {isLogin ? 'Login' : 'Register'}
            </Typography>

            {/* Εμφάνιση σφάλματος από το Zustand (login) */}
            {error && (
                <Typography color="error" variant="body2" align="center">
                    {error}
                </Typography>
            )}

            {/* Username field: εμφανίζεται μόνο στη φόρμα register */}
            {!isLogin && (
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    autoComplete="username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    {...register('username', {
                        required: 'Το username είναι υποχρεωτικό',
                        minLength: { value: 3, message: 'Τουλάχιστον 3 χαρακτήρες' },
                    })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <PersonIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            )}

            {/* Email field πάντα */}
            <TextField
                label="Email"
                type="email"
                autoComplete="email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                    required: 'Το email είναι υποχρεωτικό',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Μη έγκυρη μορφή email',
                    },
                })}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <EmailIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Password field πάντα */}
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                autoComplete="current-password"
                error={!!errors.password1}
                helperText={errors.password1?.message}
                {...register('password1', {
                    required: 'Ο κωδικός είναι υποχρεωτικός',
                    minLength: { value: 6, message: 'Τουλάχιστον 6 χαρακτήρες' },
                })}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <LockIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Confirm Password: εμφανίζεται μόνο στη φόρμα register */}
            {!isLogin && (
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    autoComplete="new-password"
                    error={!!errors.password2}
                    helperText={errors.password2?.message}
                    {...register('password2', {
                        required: 'Επιβεβαίωση κωδικού υποχρεωτική',
                        validate: (value) => value === passwordValue || 'Οι κωδικοί δεν ταιριάζουν',
                    })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <LockIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            )}

            <Button variant="contained" type="submit" fullWidth disabled={isLoading}>
                {isLoading ? (isLogin ? 'Loading...' : 'Registering...') : isLogin ? 'Login' : 'Register'}
            </Button>

            <Typography variant="body2" align="center">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link component="button" variant="body2" onClick={() => setIsLogin((prev) => !prev)}>
                    {isLogin ? 'Register now' : 'Login here'}
                </Link>
            </Typography>
        </Box>
    )
}
