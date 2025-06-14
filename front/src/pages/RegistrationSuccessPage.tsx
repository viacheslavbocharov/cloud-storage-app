import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-green-600">
              ✅ Registration Successful
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              Check your email to verify your account before logging in.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-4">
            <Link to="/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
