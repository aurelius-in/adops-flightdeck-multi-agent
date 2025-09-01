import { Donut, Bar } from "../lib/charts";

export default function Dashboard(){
  return (
    <div className="space-y-4">
      <div className="card p-4" title="KPIs">
        <div className="font-medium mb-2 text-brand-blue">KPIs</div>
        <div className="flex items-center gap-4">
          <Donut value={75} total={100} />
          <Bar data={[{label:"iROAS", value: 2.3},{label:"CPA", value: 36},{label:"Spend", value: 200}]} />
        </div>
      </div>
      <div className="card p-4" title="Approvals">
        <div className="font-medium mb-2 text-brand-blue">Action Queue highlights</div>
        <div className="text-sm text-neutral-300">Top 3 pending items by impact.</div>
      </div>
    </div>
  );
}


