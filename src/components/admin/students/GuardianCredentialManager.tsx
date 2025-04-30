
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateGuardianCredentials } from "@/utils/authUtils";
import { useToast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";

interface GuardianCredentialManagerProps {
  studentId: string;
  studentName: string;
  guardianName: string;
  currentUsername: string;
}

const GuardianCredentialManager: React.FC<GuardianCredentialManagerProps> = ({
  studentId,
  studentName,
  guardianName,
  currentUsername,
}) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateCredentials = () => {
    // Basic validation
    if (!newUsername && !newPassword) {
      toast({
        title: "Error",
        description: "Please provide a new username or password",
        variant: "destructive"
      });
      return;
    }

    // Call the update function
    const result = updateGuardianCredentials(
      studentId,
      newUsername || undefined,
      newPassword || undefined
    );
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Guardian credentials updated successfully",
      });
      
      // Reset form and close dialog
      setNewUsername("");
      setNewPassword("");
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Key className="h-3.5 w-3.5" />
          Edit Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Guardian Credentials</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="student" className="text-right">
              Student:
            </Label>
            <div className="col-span-3">
              <p className="text-sm font-medium">{studentName}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="guardian" className="text-right">
              Guardian:
            </Label>
            <div className="col-span-3">
              <p className="text-sm font-medium">{guardianName}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="currentUsername" className="text-right">
              Current Username:
            </Label>
            <div className="col-span-3">
              <p className="text-sm font-medium">{currentUsername}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="newUsername" className="text-right">
              New Username:
            </Label>
            <div className="col-span-3">
              <Input
                id="newUsername"
                placeholder="Leave blank to keep current"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="newPassword" className="text-right">
              New Password:
            </Label>
            <div className="col-span-3">
              <Input
                id="newPassword"
                type="password"
                placeholder="Leave blank to keep current"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateCredentials}>
            Update Credentials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuardianCredentialManager;
