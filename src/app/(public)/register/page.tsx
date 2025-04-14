'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { redirect } from "next/navigation"
import { Figtree } from 'next/font/google'
import CumstomNotification from "@/components/CustomNotification"
import setCookie from "./action"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, LogOut, UserPlus, Waves } from "lucide-react"
import { CustomButton } from "@/components/CustomButton"

const figtree = Figtree({ weight: '600', subsets: ['latin'] });

const userSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Preencha seu nome'
  }),
  email: z.string().email({
    message: 'E-mail inválido'
  }),
  password: z.string().min(8, {
    message: 'A senha deve conter no mínimo 8 caracteres'
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&{}.;])[A-Za-z\d@$!%*?&{}.;]{8,}$/, {
    message: 'A senha deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.'
  }),
  confirmPassword: z.string().min(4, {
    message: 'Confirmação de senha deve ter ao menos 4 caracteres', 
  })
})
.refine(dados => dados.password === dados.confirmPassword, {
  message: 'Senhas não correspondem',
  path: ['confirmPassword']
})
.refine(dados => dados.fullName.split(' ').length > 1 && dados.fullName.split(' ')[1].length >= 1, {
  message: 'Digite seu nome completo',
  path: ['fullName']
})

type userSchema = z.infer<typeof userSchema>

function fullNameFormat(fullName :string) {
  const nameParts = fullName.split(' ')
  const fullNameFormated = nameParts.map(name => name.charAt(0).toUpperCase() + name.substring(1))
  return fullNameFormated.join(' ')
}

interface AuthenticatedData {
  id :string
  name :string
  email :string
  password :string
  createdAt :Date
  updatedAt :Date
}

export default function Register() {
  
  const [ authError, setAuthError ] = useState<string>()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<userSchema>({
    resolver: zodResolver(userSchema)
  })

  const onSubmit = (data :userSchema)=> {
    handleRegister(fullNameFormat(data.fullName), data.email, data.password)
  }

  async function handleRegister(name :string, email :string, password :string) {
    const responseRegister = await fetch("http://localhost:3100/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, password: password })
    })

    if (!responseRegister.ok) {
      const errorData = await responseRegister.json();
      setAuthError(errorData.message || "An error occurred.")
      setTimeout(() => {
        setAuthError(undefined)
      }, 4500);
    }

    handleLogin(email, password)
  }

  async function handleLogin(email :string, password :string) {
    const response = await fetch("http://localhost:3100/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    })

    if (!response.ok) {
      const errorData = await response.json();
      setAuthError(errorData.message || "An error occurred.")
      setTimeout(() => {
        setAuthError(undefined)
      }, 4500);
    }

    const authenticatedUser = await response.json()
    
    setCookie(authenticatedUser)

    redirect('/')
  }

  return (
    <main className="flex items-stretch">  
      <div className="bg-blue-500 flex-1 max-[1100px]:hidden">
        {/* frame azul do lado esquerdo */}
      </div>

      

      <div className="flex-[560px_1_0] min-[1101px]:max-w-[560px] max-[1100px]:flex-1 flex-col h-full">

        <div className="relative h-[calc(100dvh)] bg-[#1A1A1E] p-20 overflow-auto max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] custom-scrollbar"> {/*retirado do final  max-[1100px]:p-7*/}
          
          { authError && <CumstomNotification text={authError} model="" /> }

          {/* <div className="flex items-center bg-inherit gap-3 rounded-md">
            <Waves className="text-white w-7 h-7"/>
            <span className="text-white font-bold text-2xl">TIGREX</span>
          </div> */}

          <h1 className={`font-bold text-gray-300 text-2xl mt-16 mb-12 max-md:mb-8 ${figtree.className}`}>Cadastre-se gratuitamente</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[100%] rounded-md shadow-md">
            
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="fullName" className="font-sans text-gray-300">Nome completo</label>
              <Input
                id="fullName"
                {...register('fullName')}
                type="text" 
                placeholder="Seu nome completo"
                className={`bg-[#121214] text-gray-100 outline-none ${errors.fullName && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />
              { errors.fullName && <p className="text-red-700">{errors.fullName.message as string}</p> }
            </div>

            <div className="flex flex-col items-start gap-2">
              <label htmlFor="email" className="font-sans text-gray-300">E-mail</label>
              <Input
                id="email"
                {...register('email')}
                type="email" 
                placeholder="Seu e-mail"
                className={`bg-[#121214] text-gray-100 outline-none ${errors.email && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />
              { errors.email && <p className="text-red-700">{errors.email.message as string}</p> }
            </div>
              
            <div className="flex flex-col items-start gap-2 text-gray-100">
              <label htmlFor="senha" className="font-sans text-gray-300">Senha</label>
              <Input 
                id="senha"
                {...register('password')}
                type="password" 
                minLength={4}
                placeholder="Deve ter no mínimo 4 caracteres"
                className={`bg-[#121214] text-gray-100 outline-none ${errors.password && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />  
              { errors.password && <p className="text-red-700">{errors.password.message as string}</p> }
            </div>

            <div className="flex flex-col items-start gap-2 text-gray-100">
              <label htmlFor="confirmeSuaSenha" className="font-sans text-gray-300">Senha</label>
              <Input 
                id="confirmeSuaSenha"
                {...register('confirmPassword')}
                type="password" 
                minLength={4}
                placeholder="Deve ter no mínimo 4 caracteres"
                className={`bg-[#121214] text-gray-100 outline-none ${errors.confirmPassword && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />  
              { errors.confirmPassword && <p className="text-red-700">{errors.confirmPassword.message as string}</p> }
            </div>
            
            <Button 
              type="submit" 
              className="h-12 text-[17px] font-sans bg-blue-700 hover:bg-blue-500"
            >
              Cadastrar-se gratuitamente
            </Button>
          </form>

          <Separator className="mt-16 mb-6 bg-[#333339]"/>

          <CustomButton.Root onClick={()=> redirect('/sign-in')}>
            <CustomButton.IconLeft icon={LogOut}/>
            <CustomButton.Content>
              <p className="text-gray-400 text-[17px] font-semibold select-none">Já possui uma conta?</p>
              <p className="text-blue-400 text-[17px] font-semibold select-none">Entre na plataforma</p>
            </CustomButton.Content>
            <CustomButton.IconAction icon={ChevronRight}/>
          </CustomButton.Root>

        </div>
      </div>
    </main>
  )
}
