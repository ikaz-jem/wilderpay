
const DashboardLoader = await import("@/app/components/Loading").then((comp)=>comp.default)




export default function Loading () {


return (
    <div className="h-full w-full flex items-center justify-center">


        <DashboardLoader/>

    </div>
)

}