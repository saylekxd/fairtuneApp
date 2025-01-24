import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { supabase } from "../../lib/supabase"
import { useStore } from "../../store/useStore"
import { Play, Pause } from "lucide-react"
import { OptimizedImage } from "./OptimizedImage"

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

// Media query hook implementation
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    const updateMatch = () => setMatches(media.matches)
    
    updateMatch()
    media.addEventListener('change', updateMatch)
    return () => media.removeEventListener('change', updateMatch)
  }, [query])

  return matches
}

// Mobile Card Component
const MobileCard = memo(({ 
  track, 
  onSelect,
  isActive 
}: { 
  track: any;
  onSelect: () => void;
  isActive: boolean;
}) => (
  <motion.div
    className="relative w-full"
    whileTap={{ scale: 0.95 }}
  >
    <motion.div 
      className={`relative rounded-xl overflow-hidden ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <motion.div
        className="aspect-square"
        layoutId={`img-${track.uniqueId}`}
      >
        <OptimizedImage
          src={track.cover_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=400&q=75"}
          alt={track.title}
          className="w-full h-full object-cover"
          width={400}
          height={400}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="absolute bottom-0 p-4">
          <h3 className="text-lg font-semibold truncate">{track.title}</h3>
          <p className="text-sm text-zinc-300 truncate">{track.artist}</p>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
        <Play className="w-12 h-12 text-white" />
      </div>
    </motion.div>
  </motion.div>
));

// Desktop Carousel Component
const DesktopCarousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
    activeTrackId,
  }: {
    handleClick: (track: any, index: number) => void
    controls: any
    cards: any[]
    isCarouselActive: boolean
    activeTrackId: string | null
  }) => {
    const cylinderWidth = 1800
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    useEffect(() => {
      if (!isCarouselActive) {
        controls.stop()
      }
    }, [isCarouselActive, controls])

    return (
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <motion.div
            drag={isCarouselActive ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
            style={{
              transform,
              rotateY: rotation,
              width: cylinderWidth,
              transformStyle: "preserve-3d",
              pointerEvents: isCarouselActive ? "auto" : "none",
            }}
            onDrag={(_, info) =>
              isCarouselActive &&
              rotation.set(rotation.get() + info.offset.x * 0.05)
            }
            onDragEnd={(_, info) =>
              isCarouselActive &&
              controls.start({
                rotateY: rotation.get() + info.velocity.x * 0.05,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  mass: 0.1,
                },
              })
            }
            animate={controls}
          >
            {cards.map((track, i) => {
              const isActive = track.id === activeTrackId
              return (
                <motion.div
                  key={`key-${track.uniqueId}`}
                  className={`absolute flex h-full origin-center items-center justify-center rounded-xl p-2 ${
                    isActive ? 'z-10' : ''
                  }`}
                  style={{
                    width: `${faceWidth}px`,
                    transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                    pointerEvents: isCarouselActive ? "auto" : "none",
                  }}
                >
                  <motion.div 
                    className={`relative w-full ${
                      isActive ? 'scale-110 shadow-2xl' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isCarouselActive) {
                        handleClick(track, i)
                      }
                    }}
                  >
                    <motion.div
                      layoutId={`img-${track.uniqueId}`}
                      className="aspect-square rounded-xl overflow-hidden"
                    >
                      <OptimizedImage
                        src={track.cover_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=400&q=75"}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        width={400}
                        height={400}
                        initial={{ filter: "blur(4px)" }}
                        animate={{ filter: "blur(0px)" }}
                        transition={transition}
                        draggable={false}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    )
  }
)

export function ThreeDPhotoCarousel() {
  const [activeTrack, setActiveTrack] = useState<any | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()
  const [tracks, setTracks] = useState<any[]>([])
  const { playTrack, currentTrack, isPlaying, togglePlay, initAudio } = useStore()
  const [previewTimer, setPreviewTimer] = useState<NodeJS.Timeout | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAudio()
  }, [initAudio])

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const { data } = await supabase
          .from('tracks')
          .select('*')
          .limit(10)
        
        if (data) {
          const duplicatedTracks = Array(Math.ceil(14 / data.length))
            .fill(data)
            .flat()
            .slice(0, 14)
            .map((track, index) => ({
              ...track,
              uniqueId: `${track.id}-${index}`
            }))
          setTracks(duplicatedTracks)
        }
      } catch (error) {
        console.error('Error loading tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTracks()
  }, [])

  const handleClick = async (track: any) => {
    if (activeTrack?.id === track.id) {
      await togglePlay()
      return
    }

    if (previewTimer) {
      clearTimeout(previewTimer)
      setPreviewTimer(null)
    }

    setActiveTrack(track)
    setIsCarouselActive(false)
    await playTrack(track)

    const timer = setTimeout(async () => {
      await togglePlay()
      setActiveTrack(null)
      setIsCarouselActive(true)
    }, 300000)

    setPreviewTimer(timer)
  }

  const handleClose = async (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (previewTimer) {
        clearTimeout(previewTimer)
        setPreviewTimer(null)
      }
      if (isPlaying) {
        await togglePlay()
      }
      setActiveTrack(null)
      setIsCarouselActive(true)
    }
  }

  if (loading) {
    return (
      <div className="relative h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="relative h-[300px] overflow-hidden">
      <AnimatePresence mode="wait">
        {activeTrack && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layoutId={`img-container-${activeTrack.uniqueId}`}
            layout="position"
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 m-5 md:m-36 lg:mx-[19rem] rounded-3xl backdrop-blur-sm"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
            onClick={handleClose}
          >
            <div 
              className="bg-zinc-900/90 p-8 rounded-xl max-w-md w-full text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                layoutId={`img-${activeTrack.uniqueId}`}
                className="w-32 h-32 mx-auto rounded-lg overflow-hidden shadow-lg mb-4"
              >
                <OptimizedImage
                  src={activeTrack.cover_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=400&q=75"}
                  alt={activeTrack.title}
                  className="w-full h-full object-cover"
                  width={128}
                  height={128}
                  draggable={false}
                />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{activeTrack.title}</h3>
              <p className="text-zinc-400 mb-4">{activeTrack.artist}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                  className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose(e)
                  }}
                  className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile ? (
        <div className="grid grid-cols-2 gap-4 px-4">
          {tracks.slice(0, 6).map((track) => (
            <MobileCard
              key={track.uniqueId}
              track={track}
              onSelect={() => handleClick(track)}
              isActive={activeTrack?.id === track.id}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {isCarouselActive && (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DesktopCarousel
                handleClick={handleClick}
                controls={controls}
                cards={tracks}
                isCarouselActive={isCarouselActive}
                activeTrackId={activeTrack?.id || null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}