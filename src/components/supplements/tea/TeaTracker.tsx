
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeaHistoryTab } from "./tabs/TeaHistoryTab"
import { TeaLibraryTab } from "./tabs/TeaLibraryTab"
import { TeaEquipmentTab } from "./tabs/TeaEquipmentTab"

export function TeaTracker() {
  return (
    <Tabs defaultValue="history" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="library">Tea Library</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
      </TabsList>

      <TabsContent value="history">
        <TeaHistoryTab />
      </TabsContent>

      <TabsContent value="library">
        <TeaLibraryTab />
      </TabsContent>

      <TabsContent value="equipment">
        <TeaEquipmentTab />
      </TabsContent>
    </Tabs>
  )
}
