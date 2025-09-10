'use client'

import { useState } from 'react';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import { ClipLoader } from 'react-spinners';
import { countries } from './countries'; // You’ll need a country list
import { toast } from 'sonner';
import axios from 'axios';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

import { FaCheck } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

import clsx from 'clsx'

export default function PaymentSettings({user}) {
  const [bep20, setBep20] = useState(user.name);
  const [country, setCountry] = useState(user.country || "Set country");
  const [trc20, setTrc20] = useState('');
  const [email, setEmail] = useState(user.email)
  const [selected, setSelected] = useState( user?.country || countries[1])
  const [phone, setPhone] = useState(user.phone || "set Phone");
  
  const [isPending, setIsPending] = useState(false);

console.log(user)


  const handleUpdate = async () => {
    setIsPending(true);
    try {
      await axios.post('/api/user/update-profile', {
        name, country, phone, password,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Update failed');
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-6 p-5 relative w-full">
      {isPending && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-10">
          <ClipLoader size={30} color="white" />
        </div>
      )}

      <h2 className="text-lg font-semibold">Payment Settings</h2>

      <div className="space-y-3">
        <p className="font-medium">{email}</p>
        <p className="text-sm font-medium">USDT Address BEP20</p>
        <input
          className="w-full p-3 text-sm text-white bg-white/10 rounded outline-none"
          placeholder="0xd74182683Cfea6aA0780F7C1BFa9e26e13d9e484"
          value={bep20}
          onChange={(e) => setBep20(e.target.value)}
        />



        <p className="text-sm font-medium">USDT Address TRC20</p>
        <input
          className="w-full p-3 text-sm text-white bg-white/10 rounded outline-none"
          
          placeholder="0xd74182683Cfea6aA0780F7C1BFa9e26e13d9e484"
          value={trc20}
          onChange={(e) => setTrc20(e.target.value)}
        />
        
      </div>

      <div className="pt-4">
        <ButtonPrimary className='w-full' onClick={handleUpdate} disabled={isPending}> 
          Save Changes
        </ButtonPrimary>
      </div>
    </div>
  );
}



