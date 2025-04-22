'use client'

import { AuthContext, AuthProvider } from "@/lib/authcontext";
import "../globals.css"
import Image from "next/image";
import logoSinir from "../../public/logo_sinir_negativa1.png"
import { LogOut } from "lucide-react";
import { LoginResponseI } from "@/interfaces/login.interface";
import { redirect } from "next/navigation";
import { deleteCookie } from "./(dashboard)/_actions/actions";
import { useContext, useEffect } from "react";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { loginResponse, initialize } = useContext(AuthContext)

  function handleDisconnect() {
    deleteCookie()
    redirect('/sign-in')
  }

  useEffect(()=> {
    initialize()
  }, [])

  interface MenuBarProps {
    loginResponse :LoginResponseI | undefined
  }

  function MenuBar({ loginResponse } :MenuBarProps) {
    return(
      <nav aria-label="Menu de navegação desktop" className="hidden overflow-x-clip border-b border-gray-200 xl:block bg-[#00695C]">
        <div className="relative">
          <ul aria-orientation="horizontal" className="mx-auto hidden max-w-[120rem] items-center justify-between p-1 text-sm xl:flex xl:px-5">
            <li className="flex items-center gap-5 divide-x divide-[#FFFFFF70]">
              <ul className="flex items-center text-gray-200 transition-colors">
                <Image alt="" src={logoSinir} width={140} height={80} />
              </ul>
              <ul className="flex items-stretch gap-2 px-5">
                <div className="flex flex-col">
                  <span className="text-white font-bold">{`${loginResponse?.objetoResposta.parCodigo} - ${loginResponse?.objetoResposta.parDescricao}`}</span>
                  <span className="text-white/70 text-xs">{`Usuário: ${loginResponse?.objetoResposta.paaCpf} - ${loginResponse?.objetoResposta.paaNome}`}</span>
                  <span className="text-white/70 text-xs">{`Perfil: ${loginResponse?.objetoResposta.gerador? "/Gerador" :""}${loginResponse?.objetoResposta.destinador? "/Destinador" :""}${loginResponse?.objetoResposta.armazenadorTemporario? "/Armazenador Temporário" :""}`}</span>
                </div>
                {/* <li className="flex items-center lg:w-[52px] w-[44px] h-10"> */}
                  {/* colocar algo aqui */}
                {/* </li> */}
                
              </ul>
              
            </li>
              <div 
                className="bg-[#00BCD4] flex justify-end rounded-full shadow-md shadow-black/40 p-2 text-white font-semibold select-none cursor-pointer"
                onClick={()=> handleDisconnect()}  
              >
                <LogOut />
              </div>
          </ul>

        </div>
      </nav>
    )
  }
  
  return (
      <div className="">
        <MenuBar loginResponse={loginResponse}/>
        { children }
      </div>
  );
}
