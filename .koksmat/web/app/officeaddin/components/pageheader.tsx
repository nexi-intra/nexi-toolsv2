export function PageHeader(props: { title: string; subtitle?: string }) {
    return (
        <div className="rounded-xl bg-slate-800 text-gray-50">
		<div className="p-4 text-3xl">{props.title} </div>

</div>
    )
    }