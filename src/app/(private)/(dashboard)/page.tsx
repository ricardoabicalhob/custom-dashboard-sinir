'use client'

import { deleteCookie, getCookie } from "./_actions/actions";
import { redirect } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authcontext";
import { AuthToken } from "@/lib/types";
import jwt from "jsonwebtoken";
import { LoginResponseI } from "@/interfaces/login.interface";
import { MTRResponseI } from "@/interfaces/mtr.interface";
import { GetMTRs } from "./_actions/getMTRs";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale"
import { CalendarIcon, LogOut } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { GetMTRsArmazTemp } from "./_actions/getMTRsArmazTemp";
import GraficoDestinacao from "./_components/GraficoDestinacao";
import GraficoAT from "./_components/GraficoAT";

const periodoSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional()
  }).optional()
})
type periodoSchema = z.infer<typeof periodoSchema>

export interface DataFilteredProps {
  numeroMtr :string, 
  unidadeDescricao :string,
  destinadorDescricao :string,
  residuoCodigoIbama :string, 
  residuoDescricao :string, 
  quantidadeEstimada :number, 
  quantidadeReal :number, 
  situacao :string, 
  medidaUnidade :string,
  dataRecebimentoAT :string
}

export default function Dashboard() {

  const [ auth, setAuth ] = useState<string>()
  const [ data, setData ] = useState<MTRResponseI[]>()
  const [ dataFiltered, setDataFiltered ] = useState<DataFilteredProps[]>()
  const [ dataFilteredArmazTemp, setDataFilteredArmazTemp ] = useState<DataFilteredProps[]>()
  const [ dateRange, setDateRange ] = useState<DateRange>()

  console.log("dado console.log somente para usar a variavel e impedir erro no buil", data)

  const { 
    setToken,
    loginResponse, setLoginResponse 
  } = useContext(AuthContext)

  async function initialize() {
    const tokenData :LoginResponseI = await getCookie()
    setLoginResponse(tokenData)
    const tokenDecoded = jwt.decode(tokenData.objetoResposta.token, {complete: true})
    setToken(tokenDecoded?.payload as AuthToken)
    setAuth(tokenData.objetoResposta.token)
  }

  useEffect(()=> {
    const periodo = handleSelectDate(dateRange)
    if(auth && loginResponse && periodo?.from && periodo.to) {
      const response = GetMTRs(auth, loginResponse, periodo?.from, periodo?.to)
      Promise.resolve(response)
        .then(response => {
          setData(prevData => [...(prevData || []), ...response.armazenamentoTemporario?.data || [], ...response.gerador?.data ||[]])
          setDataFiltered(prevDataFiltered => [...(prevDataFiltered || []), ...response.armazenamentoTemporario?.dataFiltered || [], ...response.gerador?.dataFiltered || []])
        })

      const responseAT = GetMTRsArmazTemp(auth, loginResponse, periodo.from, periodo.to)
      Promise.resolve(responseAT)
        .then(response => {
          setDataFilteredArmazTemp(prevDataFiltered => [...(prevDataFiltered || []), ...response.armazenadorTempResult?.dataFiltered || []])
        })
    }
  }, [auth])

  useEffect(()=> {
    initialize()
  }, [])

  function handleDisconnect() {
    deleteCookie()
    redirect('/sign-in')
  }

  function BarraDePesquisa() {
    return(
      <div className="bg-white flex items-end border-b gap-2 h-fit py-2 px-2 z-50">
        <DateRangePicker />
      </div>
    )
  }

  function handleSelectDate(valueSelected :DateRange | undefined) {
    if(valueSelected) {
      const inicioPeriodo = valueSelected?.from?.toLocaleDateString("pt-BR").replace(/\//g, "-")
      const fimPeriodo = valueSelected?.to?.toLocaleDateString("pt-BR").replace(/\//g, "-")
      return {from: inicioPeriodo, to: fimPeriodo}
    }
  }

  function handlePesquisar(periodo :{ from :string | undefined, to :string | undefined }) {
      setData([])
      setDataFiltered([])
      setDataFilteredArmazTemp([])
      
      if(auth && loginResponse && periodo.from && periodo.to) {
        const responseArmazTemp = GetMTRsArmazTemp(auth, loginResponse, periodo.from, periodo.to)
        Promise.resolve(responseArmazTemp)
          .then(response => {
            setDataFilteredArmazTemp(prevDataFiltered => [...(prevDataFiltered || []), ...response.armazenadorTempResult?.dataFiltered || []])
          })

        const response = GetMTRs(auth, loginResponse, periodo.from, periodo.to)
        Promise.resolve(response)
          .then(response => {
            setData(prevData => [...(prevData || []), ...response.armazenamentoTemporario?.data || [], ...response.gerador?.data ||[]])
            setDataFiltered(prevDataFiltered => [...(prevDataFiltered || []), ...response.armazenamentoTemporario?.dataFiltered || [], ...response.gerador?.dataFiltered || []])
          })
      }
  }

  function DateRangePicker() {
    const [ defaultStartDate, setDefaultStartDate ] = useState<DateRange | undefined>({
      from: dateRange? dateRange.from : subDays(new Date(Date.now()), 31),
      to: dateRange? dateRange.to : new Date(Date.now())
    })

    useEffect(()=> {
      if(dateRange) {
        setDefaultStartDate(dateRange)
      } else {
        setDateRange(defaultStartDate)
      }
    }, [dateRange])
    
    const form = useForm<periodoSchema>({
      resolver: zodResolver(periodoSchema),
      defaultValues: {
        dateRange: {
          from: defaultStartDate?.from,
          to: defaultStartDate?.to
        }
      }
    })

    function onSubmit(data :periodoSchema) {
      const periodo = handleSelectDate(data.dateRange)
      if(periodo) {
        handlePesquisar(periodo)
        setDateRange(data.dateRange)
      }
    }

    return(
      <Form {...form}>
        <form id="formPeriodo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField 
            control={form.control}
            name="dateRange"
            render={({ field })=> (
              <FormItem className="flex flex-col">
                <FormLabel>Período</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !field.value?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y", { locale: ptBR })} -{" "}
                            {format(field.value.to, "LLL dd, y", { locale: ptBR })}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y", { locale: ptBR })
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={3}
                      locale={ptBR}
                    />
                    <div className="flex w-full justify-end px-4 py-3 bg-gray-100">
                      <Button form="formPeriodo" type="submit" className="bg-[#00695C] hover:bg-[#00695C95]">Pesquisar</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }

  return (
    <Suspense fallback="Carregando...">
      <div>
        <header className="relative z-40 w-full bg-gray-900 lg:sticky lg:top-0">
          <nav aria-label="Menu de navegação mobile" className="overflow-x-clip border-b border-[#333339] xl:block bg-[#1A1A1E]">
            <div className="relative">
              <ul aria-orientation="horizontal" className="flex items-center justify-between border-b border-gray-700 px-5 py-4 xl:hidden">
                {/* <CustomMenu token={token} initialsName={getUserNameInitials()} logoutAction={handleDisconnect} loginResponse={loginResponse}/> */}
              </ul>
            </div>
          </nav>
          <nav aria-label="Menu de navegação desktop" className="hidden overflow-x-clip border-b border-gray-200 xl:block bg-[#00695C]">
            <div className="relative">
              <ul aria-orientation="horizontal" className="mx-auto hidden max-w-[120rem] items-center justify-between p-4 text-sm xl:flex xl:px-5">
                <li className="flex items-center gap-5 divide-x divide-[#FFFFFF70]">
                  <ul className="flex items-center text-gray-200 transition-colors">
                    {/* <CustomMenu token={token} initialsName={getUserNameInitials()} logoutAction={handleDisconnect} loginResponse={loginResponse}/> */}
                    <span className="font-semibold text-2xl">SINIR</span>
                  </ul>
                  <ul className="flex items-stretch gap-2 px-5">
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{`${loginResponse?.objetoResposta.parCodigo} - ${loginResponse?.objetoResposta.parDescricao}`}</span>
                      <span className="text-white/70 text-xs">{`Usuário: ${loginResponse?.objetoResposta.paaCpf} - ${loginResponse?.objetoResposta.paaNome}`}</span>
                      <span className="text-white/70 text-xs">{`Perfil: ${loginResponse?.objetoResposta.gerador? "/Gerador" :""}${loginResponse?.objetoResposta.destinador? "/Destinador" :""}${loginResponse?.objetoResposta.armazenadorTemporario? "/Armazenador Temporário" :""}`}</span>
                    </div>
                    <li className="flex items-center lg:w-[52px] w-[44px] h-10">
                      {/* colocar algo aqui */}
                    </li>
                    
                  </ul>
                    
                </li>
                  <div 
                    className="bg-[#00BCD4] flex justify-end rounded-full p-2 text-white font-semibold select-none cursor-pointer"
                    onClick={()=> handleDisconnect()}  
                  >
                    <LogOut />
                  </div>
              </ul>

              <BarraDePesquisa />
            </div>
          </nav>
        </header>
        <main>
          <div className="w-full h-[calc(100vh-73px)] p-6 gap-2 relative bg-white">
            <div className="grid grid-cols-1 gap-2">

              <GraficoDestinacao 
                dataFiltered={dataFiltered}
                title={`Destinação de resíduos`}
                subTitle={`${dateRange ?  "Período: " + dateRange?.from?.toLocaleDateString() + " a " + dateRange?.to?.toLocaleDateString() : ""}`}
              />

              {loginResponse && loginResponse.objetoResposta && !!loginResponse.objetoResposta.armazenadorTemporario && 
                <GraficoAT
                  title={`Quantidade estimada em Armazenamento Temporário`}
                  subTitle={`MTRs emitidos no período de ${dateRange? dateRange.from?.toLocaleDateString() + " a " + dateRange.to?.toLocaleDateString() :""}`}
                  dataFiltered={dataFilteredArmazTemp}
                />}
            </div>
            <br/>
            <br/>
            {/* <Table>
              <TableCaption>Uma lista de seus manifestos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Número do MTR</TableHead>
                  <TableHead>Gerador</TableHead>
                  <TableHead>Destinador</TableHead>
                  <TableHead>Resíduo</TableHead>
                  <TableHead>Quantidade Estimada</TableHead>
                  <TableHead>Quantidade Real</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
              dataFiltered?.map(item => (
                <TableRow key={item.numeroMtr}>
                  <TableCell className="text-black font-semibold">{item.numeroMtr}</TableCell>
                  <TableCell className="text-black">{item.unidadeDescricao}</TableCell>
                  <TableCell className="text-black">{item.destinadorDescricao}</TableCell>
                  <TableCell className="text-black">{`${item.residuoCodigoIbama} - ${item.residuoDescricao}`}</TableCell>
                  <TableCell className="text-black text-right">{`${item.quantidadeEstimada.toFixed(2)} ${item.medidaUnidade}`}</TableCell>
                  <TableCell className="text-black text-right">{`${item.quantidadeReal?.toFixed(2) || "-"} ${item.quantidadeReal? item.medidaUnidade :""}`}</TableCell>
                  <TableCell className="text-black">{item.situacao}</TableCell>
                </TableRow>
              ))
            }    
              </TableBody>
            </Table>
                   
            <Table>
              <TableCaption>Uma lista de seus manifestos para armazenamento temporário</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Número do MTR</TableHead>
                  <TableHead>Gerador</TableHead>
                  <TableHead>Resíduo</TableHead>
                  <TableHead>Quantidade Estimada</TableHead>
                  <TableHead>Data do recebimento no AT</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
              dataFilteredArmazTemp?.map(item => (
                <TableRow key={item.numeroMtr}>
                  <TableCell className="text-black font-semibold">{item.numeroMtr}</TableCell>
                  <TableCell className="text-black">{item.unidadeDescricao}</TableCell>
                  <TableCell className="text-black">{`${item.residuoCodigoIbama} - ${item.residuoDescricao}`}</TableCell>
                  <TableCell className="text-black text-right">{`${item.quantidadeEstimada.toFixed(2)} ${item.medidaUnidade}`}</TableCell>
                  <TableCell className="text-black text-right">{`${item.dataRecebimentoAT}`}</TableCell>
                  <TableCell className="text-black">{item.situacao}</TableCell>
                </TableRow>
              ))
            }    
              </TableBody>
            </Table> */}
          </div>
          
        </main>      
      </div>
    </Suspense>
  );
}
  