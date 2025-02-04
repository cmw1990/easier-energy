import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface AdditionalDetailsProps {
  batchNumber: string;
  setBatchNumber: (value: string) => void;
  expirationDate: string;
  setExpirationDate: (value: string) => void;
  storageConditions: string;
  setStorageConditions: (value: string) => void;
  purchaseLocation: string;
  setPurchaseLocation: (value: string) => void;
  verifiedPurchase: boolean;
  setVerifiedPurchase: (value: boolean) => void;
  sideEffects: string;
  setSideEffects: (value: string) => void;
  timingNotes: string;
  setTimingNotes: (value: string) => void;
  interactionNotes: string;
  setInteractionNotes: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

export function AdditionalDetails({
  batchNumber,
  setBatchNumber,
  expirationDate,
  setExpirationDate,
  storageConditions,
  setStorageConditions,
  purchaseLocation,
  setPurchaseLocation,
  verifiedPurchase,
  setVerifiedPurchase,
  sideEffects,
  setSideEffects,
  timingNotes,
  setTimingNotes,
  interactionNotes,
  setInteractionNotes,
  notes,
  setNotes,
}: AdditionalDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input
            id="batchNumber"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="Enter batch number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date</Label>
          <Input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storageConditions">Storage Conditions</Label>
          <Input
            id="storageConditions"
            value={storageConditions}
            onChange={(e) => setStorageConditions(e.target.value)}
            placeholder="How should this be stored?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseLocation">Purchase Location</Label>
          <Input
            id="purchaseLocation"
            value={purchaseLocation}
            onChange={(e) => setPurchaseLocation(e.target.value)}
            placeholder="Where did you buy it?"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="verifiedPurchase"
          checked={verifiedPurchase}
          onCheckedChange={setVerifiedPurchase}
        />
        <Label htmlFor="verifiedPurchase">Verified Purchase</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sideEffects">Side Effects</Label>
        <Input
          id="sideEffects"
          value={sideEffects}
          onChange={(e) => setSideEffects(e.target.value)}
          placeholder="Any side effects?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timingNotes">Timing Notes</Label>
        <Textarea
          id="timingNotes"
          value={timingNotes}
          onChange={(e) => setTimingNotes(e.target.value)}
          placeholder="When did you take it? With food?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interactionNotes">Interaction Notes</Label>
        <Textarea
          id="interactionNotes"
          value={interactionNotes}
          onChange={(e) => setInteractionNotes(e.target.value)}
          placeholder="Any interactions with other supplements or medications?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional observations or notes"
        />
      </div>
    </div>
  );
}