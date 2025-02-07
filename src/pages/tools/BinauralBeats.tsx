
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { Slider } from "@/components/ui/slider"

export default function BinauralBeats() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [baseFrequency, setBaseFrequency] = useState(200)
  const [beatFrequency, setBeatFrequency] = useState(10)
  const [volume, setVolume] = useState(0.5)
  const [preset, setPreset] = useState("focus")
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const [oscillators, setOscillators] = useState<any[]>([])

  const presets = {
    focus: { base: 200, beat: 10 },
    meditation: { base: 100, beat: 4 },
    relaxation: { base: 300, beat: 6 },
    sleep: { base: 150, beat: 2 }
  }

  useEffect(() => {
    return () => {
      oscillators.forEach(osc => {
        try {
          osc.stop()
          osc.disconnect()
        } catch (e) {
          console.log('Oscillator already stopped')
        }
      })
    }
  }, [oscillators])

  const startTone = () => {
    const leftOsc = audioContext.createOscillator()
    const rightOsc = audioContext.createOscillator()
    const leftGain = audioContext.createGain()
    const rightGain = audioContext.createGain()
    const merger = audioContext.createChannelMerger(2)

    leftGain.gain.value = volume
    rightGain.gain.value = volume

    leftOsc.frequency.value = baseFrequency
    rightOsc.frequency.value = baseFrequency + beatFrequency

    leftOsc.connect(leftGain)
    rightOsc.connect(rightGain)
    leftGain.connect(merger, 0, 0)
    rightGain.connect(merger, 0, 1)
    merger.connect(audioContext.destination)

    leftOsc.start()
    rightOsc.start()

    setOscillators([leftOsc, rightOsc])
    setIsPlaying(true)
  }

  const stopTone = () => {
    oscillators.forEach(osc => {
      try {
        osc.stop()
        osc.disconnect()
      } catch (e) {
        console.log('Oscillator already stopped')
      }
    })
    setOscillators([])
    setIsPlaying(false)
  }

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const presetValues = presets[value as keyof typeof presets]
    setBaseFrequency(presetValues.base)
    setBeatFrequency(presetValues.beat)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Binaural Beats Generator</CardTitle>
            <CardDescription>
              Generate binaural beats for focus, meditation, and relaxation. Use headphones for best results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preset</Label>
                <Select value={preset} onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="focus">Focus (Alpha: 8-12 Hz)</SelectItem>
                    <SelectItem value="meditation">Meditation (Theta: 4-8 Hz)</SelectItem>
                    <SelectItem value="relaxation">Relaxation (Alpha: 6-10 Hz)</SelectItem>
                    <SelectItem value="sleep">Sleep (Delta: 1-4 Hz)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base Frequency ({baseFrequency} Hz)</Label>
                <Input
                  type="range"
                  min="100"
                  max="400"
                  value={baseFrequency}
                  onChange={(e) => setBaseFrequency(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Beat Frequency ({beatFrequency} Hz)</Label>
                <Input
                  type="range"
                  min="1"
                  max="30"
                  value={beatFrequency}
                  onChange={(e) => setBeatFrequency(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Volume</Label>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={1}
                  step={0.1}
                />
              </div>

              <Button
                onClick={isPlaying ? stopTone : startTone}
                className="w-full"
              >
                {isPlaying ? "Stop" : "Start"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
