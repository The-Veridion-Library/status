import { getServices } from "@/lib/github";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const services = await getServices();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      {/* Page header */}
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">The Veridion Library Status</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        All system components and services, live status directly from GitHub Issues.
      </p>

      {/* Status cards container */}
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {services.map((service) => {
          let statusColor = "bg-gray-400";
          if (service.status === "up") statusColor = "bg-green-500";
          else if (service.status === "degraded") statusColor = "bg-yellow-500";
          else if (service.status === "down") statusColor = "bg-red-500";

          return (
            <Card key={service.name} className="p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <Badge
                className={`w-4 h-4 rounded-full mb-4 ${statusColor}`}
              />
              <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Last updated: {new Date(service.lastUpdated).toLocaleString()}
              </p>
              <Separator className="my-2" />
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium">{service.status.toUpperCase()}</span>
              </p>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-400 text-sm">
        Powered by GitHub Issues & Actions
      </p>
    </main>
  );
}