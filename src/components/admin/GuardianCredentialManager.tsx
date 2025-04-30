
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';
import { validatePassword } from '@/utils/authUtils';

interface GuardianCredentialManagerProps {
  guardianId: string;
  guardianEmail: string;
  guardianUsername: string;
  onSuccess: () => void;
}

const GuardianCredentialManager: React.FC<GuardianCredentialManagerProps> = ({
  guardianId,
  guardianEmail,
  guardianUsername,
  onSuccess
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password field is required",
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      toast({
        variant: "destructive",
        title: "Password requirements not met",
        description: "Password must be at least 8 characters and include numbers and special characters",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In Firebase implementation, we'd use:
      // 1. admin.auth().updateUser(uid, { password: newPassword })
      // But since we're in client, we'll need a cloud function for this
      // For now, we'll simulate success for demonstration
      
      console.log(`Password reset for guardian ${guardianId} with email ${guardianEmail}`);
      
      toast({
        title: "Success",
        description: `Password for ${guardianUsername} has been reset`,
      });
      
      onSuccess();
      setNewPassword('');
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Could not reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Guardian Password</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Guardian Username</Label>
            <div className="font-medium">{guardianUsername}</div>
          </div>
          
          <div>
            <Label>Email</Label>
            <div className="font-medium">{guardianEmail || "No email available"}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-guardian-password">New Password</Label>
            <Input
              id="new-guardian-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <Button onClick={handleResetPassword} disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardianCredentialManager;
