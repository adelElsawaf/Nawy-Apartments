import ApartmentDetails from "@/features/apartments/ApartmentDetails";

type ApartmentPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Apartment | NawyTask",
};

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { id } = await params;
  return <ApartmentDetails id={id} />;
}
