import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signUp(data.email, data.password, data.displayName);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Konto erstellen
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Registrieren Sie sich für RecipeMaster
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Name"
              type="text"
              placeholder="Ihr Name"
              leftIcon={<User className="w-5 h-5 text-gray-400" />}
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label="E-Mail"
              type="email"
              placeholder="ihre@email.de"
              leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Passwort"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Passwort bestätigen"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Registrieren
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Bereits ein Konto? </span>
              <a
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Jetzt anmelden
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
