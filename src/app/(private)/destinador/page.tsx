'use client'

import { AuthContext } from "@/lib/authcontext"
import { useContext, useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, subDays } from "date-fns"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import GraficoDestinacao from "../(dashboard)/_components/GraficoDestinacao"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GetAllDestinador } from "./_actions/getAllDestinador"
import GraficoAT from "../(dashboard)/_components/GraficoAT"

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

export default function DestinadorPage() {

    const {
        token, loginResponse
    } = useContext(AuthContext)

    const [ receivedAsSender, setReceivedAsSender ] = useState<DataFilteredProps[]>()
    const [ createdForDestination, setCreatedForDestination ] = useState<DataFilteredProps[]>()
    const [ dateRange, setDateRange ] = useState<DateRange>()

    
    function handleSelectDate(valueSelected :DateRange | undefined) {
        if(valueSelected) {
        const inicioPeriodo = valueSelected?.from?.toLocaleDateString("pt-BR").replace(/\//g, "-")
        const fimPeriodo = valueSelected?.to?.toLocaleDateString("pt-BR").replace(/\//g, "-")
        return {from: inicioPeriodo, to: fimPeriodo}
        }
    }

    async function handlePesquisar(periodo :{ from :string | undefined, to :string | undefined }) {
        setCreatedForDestination([])
        setReceivedAsSender([])
        
        if(token && loginResponse && periodo.from && periodo.to) {
            const response = await GetAllDestinador(loginResponse.objetoResposta.parCodigo, periodo.from, periodo.to, token)
            if(!response) { throw new Error("Nenhum mtr encotrado.") }
            setReceivedAsSender(prevData => [...(prevData || []), ...response.allMTRsDestinedReceived])
            setCreatedForDestination(prevData => [...(prevData || []), ...response.allMTRsNoFilter])
        }
    }

    useEffect(()=> {
        const periodoG = handleSelectDate(dateRange)
        
        if(token && loginResponse && periodoG?.from && periodoG.to) {
            handlePesquisar({from: periodoG.from, to: periodoG.to})
        }
    }, [token])

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

    function TabelaMTRs() {
        return(
            <Table className="flex-grow">
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
                receivedAsSender?.map(item => (
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
        )
    }

    function BarraDePesquisa() {
        return(
            <div className="flex items-center border-b gap-2 h-fit py-2 px-2 z-50 divide-x divide-gray-300">
                <DateRangePicker />
                { loginResponse?.objetoResposta.isGerador && <a href="/gerador" className="pl-2 hover:text-[#00695C]">Gerador</a> }
                { loginResponse?.objetoResposta.isArmazenadorTemporario &&  <a href="/armazenador-temporario" className="pl-2 hover:text-[#00695C]">Armazenador Temporário</a> }
                <span className="select-none pl-2 text-[#00695C] font-semibold">Destinador</span>
            </div>
        )
    }

    return(
        <div className="flex flex-col p-3 gap-2">
            <BarraDePesquisa />
            
            <div className="grid grid-rows-2 gap-2">
                <GraficoAT
                    title="Resíduos gerados para o destinador"
                    subTitle={`${dateRange ?  "Período: " + dateRange?.from?.toLocaleDateString() + " a " + dateRange?.to?.toLocaleDateString() : ""}`}
                    dataFiltered={createdForDestination}
                />

                <GraficoDestinacao
                    title="Resíduos tratados como destinador"
                    subTitle={`${dateRange ?  "Período: " + dateRange?.from?.toLocaleDateString() + " a " + dateRange?.to?.toLocaleDateString() : ""}`}
                    dataFiltered={receivedAsSender}
                />
            </div>

        </div>
    )
}