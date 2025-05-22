import Player from "@/components/formationUi/Player";




export default async function FormationPage({ params }: { params: { title: string } }) {

    const { title } = await params;
    const decodedTitle = decodeURIComponent(title);

    return (
        <Player params={{ title: decodedTitle }} />
    )
}