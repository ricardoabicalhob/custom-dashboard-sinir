'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import setCookie from "./action"
import { redirect } from "next/navigation"
import { Figtree } from 'next/font/google'
import CumstomNotification from "@/components/CustomNotification"
import Image from "next/image"
import logoSinir from "../../../public/logo_sinir_negativa1.png"

const figtree = Figtree({ weight: '600', subsets: ['latin'] });

const userSchema = z.object({
  login: z.string().min(11, {
    message: 'CPF inválido'
  }),
  senha: z.string().min(4, {
    message: 'Senha deve ter ao menos 4 caracteres'
  }),
  parCodigo: z.string().min(5, {
    message: "Unidade deve conter 5 dígitos"
  })
})

type userSchema = z.infer<typeof userSchema>

export default function SignIn() {

  const [ authError, setAuthError ] = useState()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<userSchema>({
    resolver: zodResolver(userSchema)
  })

  const onSubmit = (data :userSchema)=> {
    handleLogin(data.login, data.senha, data.parCodigo)
  }

  async function handleLogin(login :string, senha :string, parCodigo :string) {
    const response = await fetch("https://mtr.sinir.gov.br/api/mtr/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: login, senha: senha, parCodigo: parCodigo})
    })

    // const error :LoginResponseI = await response.json()
    // if(error.erro) {
    //   console.log(error.mensagem)
    // }

    if (!response.ok) {
      const errorData = await response.json();
      // throw new Error(errorData.message || "An error occurred.");
      setAuthError(errorData.message || "Ocorreu um erro.")
      setTimeout(() => {
        setAuthError(undefined)
      }, 4500);
    }

    const authenticatedUser = await response.json()

    setCookie(authenticatedUser)

    redirect('/')
  }

  return (
    // <main className="bg-[#FFF] h-[calc(100vh-24px)] w-screen overflow-x-hidden flex flex-col justify-center items-start px-8">
    <main id="containerprincipal" className="flex items-stretch">  
      <div className="bg-[#00695C] flex-1 max-[1100px]:hidden">
        <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
          <Image alt="" src={logoSinir} width={250} height={80} />
          {/* <span className="text-gray-200 text-5xl font-bold">SINIR</span> */}
          <span className="text-gray-200 text-3xl font-bold">Gestão de Resíduos Integrada ao SINIR</span>
        </div>
      </div>

      

      <div className="flex-[560px_1_0] min-[1101px]:max-w-[560px] max-[1100px]:flex-1 flex-col h-full overflow-y-auto">

        <div className="relative h-[calc(100dvh)] bg-[#FFF] p-20 overflow-auto max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] custom-scrollbar"> {/*retirado do final  max-[1100px]:p-7*/}
          
          { authError && <CumstomNotification text={authError} model="" /> }

          {/* <div className="flex items-center bg-inherit gap-3 rounded-md">
            <Waves className="text-white w-7 h-7"/>
            <span className="text-white font-bold text-2xl">TIGREX</span>
          </div> */}

          <h1 className={`font-bold text-black/80 text-2xl mt-16 mb-12 max-md:mb-8 ${figtree.className}`}>Acesse sua conta</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[100%]">
            
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="login" className="font-sans text-black/80">CPF</label>
              <Input
                id="login"
                {...register('login')}
                type="text" 
                placeholder="Seu CPF"
                className={`bg-white text-black/80 outline-none ${errors.login && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />
              { errors.login && <p className="text-red-700">{errors.login.message as string}</p> }
            </div>

            <div className="flex flex-col items-start gap-2 text-gray-100">
              <label htmlFor="parCodigo" className="font-sans text-black/80">Unidade</label>
              <Input 
                id="parCodigo"
                {...register('parCodigo')}
                type="text" 
                minLength={4}
                placeholder="Código da unidade"
                className={`bg-white text-black/80 outline-none ${errors.senha && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />  
              { errors.parCodigo && <p className="text-red-700">{errors.parCodigo.message as string}</p> }
            </div>

            <div className="flex flex-col items-start gap-2 text-gray-100">
              <label htmlFor="senha" className="font-sans text-black/80">Senha</label>
              <Input 
                id="senha"
                {...register('senha')}
                type="password" 
                minLength={4}
                placeholder="Sua senha"
                className={`bg-white text-black/80 outline-none ${errors.senha && 'border-red-700 focus:border-red-700'} text-base placeholder:text-[17px] placeholder:text-gray-400 transition-colors h-12`} 
              />  
              { errors.senha && <p className="text-red-700">{errors.senha.message as string}</p> }
            </div>

            <Button 
              type="submit" 
              className="h-12 mt-6 text-[17px] font-sans bg-[#00695C] hover:bg-[#00695C]/80"
            >
              Entrar
            </Button>
          </form>

        </div>
      </div>
    </main>
  )
}
