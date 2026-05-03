import { getServices } from "@lib/data/services"
import ServicesClient from "./_components/ServicesClient"

export default async function ServicesPage() {
  const services = await getServices()
  return <ServicesClient services={services} />
}