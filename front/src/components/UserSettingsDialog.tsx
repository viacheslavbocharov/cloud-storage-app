// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/login-01-label';
// import { Settings, Trash2 } from 'lucide-react';
// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import api from '@/utils/axios';
// import { setUserData, resetFileManager } from '@/store/fileManagerSlice';
// import { useNavigate } from 'react-router-dom';

// export function UserSettingsDialog() {
//   const user = useSelector((state: RootState) => state.fileManager);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: user.email,
//     firstName: user.firstName,
//     lastName: user.lastName,
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [open, setOpen] = useState(false);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

//   const validate = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!form.email.trim()) newErrors.email = 'Email is required';
//     else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
//       newErrors.email = 'Invalid email format';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     try {
//       const res = await api.patch('/user', form);
//       const { id, email, firstName, lastName } = res.data;
//       dispatch(setUserData({ id, email, firstName, lastName }));
//       setOpen(false);
//     } catch (err) {
//       console.error('Update failed', err);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       await api.delete('/user');
//       localStorage.removeItem('accessToken');
//       dispatch(resetFileManager());
//       navigate('/');
//     } catch (err) {
//       console.error('Account deletion failed', err);
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="cursor-pointer text-muted-foreground hover:text-primary transition"
//           >
//             <Settings className="w-5 h-5" />
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Profile</DialogTitle>
//           </DialogHeader>

//           <div className="grid gap-4 py-2">
//             <div className="grid gap-1">
//               <Label htmlFor="firstName">First Name</Label>
//               <Input
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={handleChange}
//               />
//               {errors.firstName && (
//                 <p className="text-sm text-red-500">{errors.firstName}</p>
//               )}
//             </div>
//             <div className="grid gap-1">
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={handleChange}
//               />
//               {errors.lastName && (
//                 <p className="text-sm text-red-500">{errors.lastName}</p>
//               )}
//             </div>
//             <div className="grid gap-1">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 type="email"
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-between items-center">
//             <Button
//               variant="destructive"
//               onClick={() => setConfirmDeleteOpen(true)}
//             >
//               <Trash2 className="w-4 h-4 mr-2" />
//               Delete Account
//             </Button>
//             <Button onClick={handleSubmit}>Submit</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Confirm Delete Dialog */}
//       <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
//         <DialogContent className="sm:max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Are you sure?</DialogTitle>
//           </DialogHeader>
//           <p className="text-sm text-muted-foreground">
//             This action will permanently delete your account. This cannot be
//             undone.
//           </p>
//           <div className="flex justify-end gap-2 pt-4">
//             <Button variant="ghost" onClick={() => setConfirmDeleteOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteAccount}>
//               Confirm Delete
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/login-01-label';
import { Settings, Trash2, Lock } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import api from '@/utils/axios';
import { setUserData, resetFileManager } from '@/store/fileManagerSlice';
import { useNavigate } from 'react-router-dom';

export function UserSettingsDialog() {
  const user = useSelector((state: RootState) => state.fileManager);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await api.patch('/user', form);
      dispatch(setUserData(res.data));
      setOpen(false);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user');
      localStorage.removeItem('accessToken');
      dispatch(resetFileManager());
      navigate('/');
    } catch (err) {
      console.error('Account deletion failed', err);
    }
  };

  const handleChangePassword = async () => {
    const errs: { [key: string]: string } = {};
    if (!passwordForm.oldPassword.trim())
      errs.oldPassword = 'Old password required';
    if (!passwordForm.newPassword.trim())
      errs.newPassword = 'New password required';
    else if (passwordForm.newPassword.length < 6)
      errs.newPassword = 'Password must be at least 6 characters';

    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await api.patch('/auth/change-password', passwordForm);
      setChangePasswordOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      if (err?.response?.data?.message === 'Old password is incorrect') {
        setPasswordErrors({ oldPassword: 'Incorrect old password' });
      } else {
        console.error('Password change error', err);
      }
    }
  };

  return (
    <>
      {/* Основной диалог */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-muted-foreground hover:text-primary transition"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Submit button — 1-я строка, справа */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              className="cursor-pointer px-6 py-2 bg-black text-white hover:bg-gray-800 transition rounded-md"
            >
              Submit
            </Button>
          </div>

          {/* 2-я строка кнопок: слева/справа */}
          <div className="flex justify-between pt-6">
            {/* Change Password */}
            <Button
              variant="outline"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-black hover:bg-gray-100 transition"
              onClick={() => setChangePasswordOpen(true)}
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>

            {/* Delete Account */}
            <Button
              variant="outline"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-muted-foreground bg-muted hover:bg-red-500 hover:text-white transition"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action will permanently delete your account.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 pt-2">
            <div className="grid gap-1">
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
              />
              {passwordErrors.oldPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.oldPassword}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => setChangePasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
