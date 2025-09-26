'use client'

import { useState } from 'react';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import { ClipLoader } from 'react-spinners';
import { countries } from './countries'; // You’ll need a country list
import { toast } from 'sonner';
import axios from 'axios';
import { FaEye } from "react-icons/fa6";
import { IoMdCopy } from "react-icons/io"

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

import { FaCheck } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

import clsx from 'clsx'

export default function AccountSettings({ user }) {
  const [country, setCountry] = useState(user.country || "Set country");
  const [selected, setSelected] = useState(user?.country || countries[1])
  const [phone, setPhone] = useState(user?.phone || "");
  const [credentials, setCredentials] = useState({
    phone: user?.phone,
    name: user?.name,
    password: '',
    oldPassword: '',
    email: user?.email

  })

  const [isPending, setIsPending] = useState(false);
  const [view, setView] = useState('password');
  const [viewOld, setViewOld] = useState('password');



  const handleUpdate = async () => {
    setIsPending(true);
    try {
      const res = await axios.post('/api/users/update', credentials).then((res) => res.data);
      toast.success(res.message);
    } catch (error) {
      toast.error('Update failed');
    }
    setIsPending(false);
  };

  function handleChange(e) {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const referralLink = typeof window !== "undefined" && user?.id ? `${window.location.origin}/register?id=${user?.walletIndex}` : ""
  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link)
    toast.success("copied!")
  }


  return (
    <div className="space-y-6 p-5 relative w-full">
      {isPending && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-10">
          <ClipLoader size={30} color="white" />
        </div>
      )}

      <h2 className="text-lg font-semibold">Profile Settings</h2>




      <p className=" text-xs !text-neutral">Invite Id :</p>
      <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
        <p className="text-sm break-all">{user?.walletIndex}</p>
        <button onClick={() => copyToClipboard(user?.walletIndex)} className="cursor-pointer hover:scale-110 hover:!text-green-500">
          <IoMdCopy className="text-lg" />
        </button>
      </div>
     



      <div className="space-y-3">
        <p className="font-medium">{credentials.email}</p>
        <p className="text-sm font-medium">Full Name</p>
        <input
          className="w-full p-3 text-sm text-white bg-white/10 rounded outline-none"
          placeholder="Your name"
          name='name'
          value={credentials.name}
          onChange={handleChange}
        />

        <p className="text-sm font-medium">Country</p>
        {/* <select
          className="w-full p-3 text-sm text-white bg-white/10 rounded outline-none"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select your country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
        </select> */}
        <CountrySelect selected={selected} setSelected={setSelected} />



             
        <p className="text-sm font-medium">Phone Number</p>
        <input
          className="w-full p-3 text-sm text-white bg-white/10 rounded outline-none"
          type="tel"
          placeholder="+123456789"
          name='phone'
          value={credentials?.phone}
          onChange={handleChange}
        />

        {/* <ButtonSecondary onClick={() => toast('Verification code sent')}>
          Verify Phone
        </ButtonSecondary> */}

        <p className="text-sm font-medium">Old Password</p>
        <div className='flex gep-2 items-center  bg-white/10 rounded '>

          <input
            className="w-full p-3 text-sm text-white outline-none"
            type={viewOld}
            placeholder="Old Password"
            name='oldPassword'

            onChange={handleChange}
          />
          <FaEye className='text-2xl text-neutral mx-5 cursor-pointer' onMouseOver={() => setViewOld('text')} onMouseOut={() => setViewOld('password')} />
        </div>
        <p className="text-sm font-medium">New Password</p>
        <div className='flex items-center bg-white/10 rounded '>

          <input
            className="w-full p-3 text-sm text-white outline-none "
            type={view}
            placeholder="New password"
            name="password"
            onChange={handleChange}
          />
          <FaEye className='text-2xl text-neutral mx-5 cursor-pointer' onMouseOver={() => setView('text')} onMouseOut={() => setView('password')} />
        </div>
      </div>

      <div className="pt-4">
        <ButtonPrimary className='w-full' onClick={handleUpdate} disabled={isPending}>
          Save Changes
        </ButtonPrimary>
      </div>
    </div>
  );
}




export function CountrySelect({ selected, setSelected }) {
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? countries
      : countries.filter((country) => {
        return country.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <div className="mx-auto   ">
      <Combobox value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery('')}>
        <div className="relative">
          <ComboboxInput
            className={clsx(
              'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
            )}
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <FaChevronDown className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-(--input-width) rounded-xl border border-white/5 backdrop-blur bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
          )}
        >
          {filteredPeople.map((person) => (
            <ComboboxOption
              key={person.id}
              value={person}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <FaCheck className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{person.name}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}