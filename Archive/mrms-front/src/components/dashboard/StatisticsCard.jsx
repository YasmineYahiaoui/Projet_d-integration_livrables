export default function StatisticsCard({ titre, valeur, icone: Icone, couleur }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`rounded-full p-3 ${couleur}`}>
                        <Icone className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">{titre}</h3>
                        <p className="text-2xl font-semibold text-gray-800">{valeur}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}