import Contest from './Contest';





export default async function Page({ searchParams  }) {
 
    let search   = await searchParams 
    


    return (
        <>
                <Contest urlParams={search} />
        </>
    )
}
