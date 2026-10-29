
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  RoundedBox,
  Float,
  Text,
} from "@react-three/drei";
import * as THREE from "three";
import "./index.css";

const STATIONS = [
  {
    number: 1,
    audio: "/4u-vintage-radio/assets/station1.mp3",
    image: "/4u-vintage-radio/assets/station1.jpg",
    title: "المحطة الأولى",
  },
  {
    number: 2,
    audio: "/4u-vintage-radio/assets/station2.mp3",
    image: "/4u-vintage-radio/assets/station2.jpg",
    title: "المحطة التانية",
  },
  {
    number: 3,
    audio: "/4u-vintage-radio/assets/station3.mp3",
    image: "/4u-vintage-radio/assets/station3.jpg",
    title: "المحطة التالتة",
  },
];

const LETTER_LINES = [
  { image: "/4u-vintage-radio/assets/letter1.jpg", text: "بص يا حبيبي انا مش عارفه اقولك ايه ولا ابدأ منين بس كل اللي اعرفه انك بقيت حاجه كبيرة اوي في حياتي، بقيت الشخص اللي بحب احكيله كل حاجه واللي بستنى كلامه حتى لو يومي كله كان وحش، مجرد ما بتكلمني بحس اني بقيت احسن، مش عارفه انت عملت فيا ايه بس انا بقيت بحب وجودك في كل تفاصيل يومي.", side: "left" },
  { image: "/4u-vintage-radio/assets/letter2.jpg", text: "عارف اكتر حاجه بحبها فيك ايه؟ انك بقيت قريب لقلبي بشكل انا نفسي مكنتش متوقعاه، بقيت لما يحصل معايا حاجه اول واحد ييجي في بالي هو انت، ولما افرح ببقى عايزه افرحك معايا ولما ازعل ببقى محتاجه وجودك جنبي، يمكن دي حاجات بسيطة بالنسبالك بس بالنسبالي معناها انك بقيت حته مني.", side: "left" },
  { image: "/4u-vintage-radio/assets/letter3.jpg", text: "انا بحبك بطريقتي انا، مش لازم كل يوم اعرف اقولك كلام حلو ولا اعرف اوصفلك اللي جوايا، بس والله انت في قلبي اكتر بكتير من الكلام اللي بعرف اقوله، ساعات ببقى نفسي احضنك واحكيلك قد ايه وجودك فارق معايا وقد ايه انا بخاف على زعلك وبفرح من قلبي لما الاقيك مبسوط.", side: "left" },
  { image: "/4u-vintage-radio/assets/letter4.jpg", text: "نفسي افضل الشخص اللي تيجي تحكيله لما تكون مخنوق، واللي تضحك معاه من قلبك من غير ما تفكر في اي حاجه، نفسي تبقى عارف انك مش لوحدك وان فيه حد بيحبك بجد وبيفكر فيك حتى وهو مشغول، حد بيهمه زعلك وبيفضل يدعي ان ايامك تبقى حلوه وانك تفضل مبسوط دايما.", side: "left" },
  { image: "/4u-vintage-radio/assets/letter5.jpg", text: "انا مش عايزه منك حاجات كبيرة ولا مستنيه منك تبقى كامل، انا بحبك انت زي ما انت، بعيوبك قبل مميزاتك وبأيامك الحلوه والوحشه، ولو في يوم الدنيا ضغطت عليك او حسيت انك مش قادر تعمل حاجه، متحسش انك لازم تبقى قوي طول الوقت قدامي، انا عايزاك تبقى على طبيعتك معايا وتعرف اني بحبك في كل حالاتك.", side: "left" },
  { image: "/4u-vintage-radio/assets/letter6.jpg", text: "ممكن اوقات ازعل منك او اتضايق من حاجه تعملها، وممكن معرفش اعبر صح عن اللي مضايقني، بس ده عمره ما معناه انك بقيت شخص عادي عندي، بالعكس انت من الناس اللي زعلهم بيفرق معايا واللي كلمة منهم ممكن تفرحني طول اليوم، عشان كده كل اللي بتمناه اننا نفهم بعض ونفضل نختار بعض حتى وقت الخلاف.", side: "right" },
  { image: "/4u-vintage-radio/assets/letter7.jpg", text: "عارف انا بحب اتخيل ايه؟ اننا نفضل مع بعض واحنا بنكبر، ونفتكر كل المواقف اللي حصلت بينا ونضحك عليها، نفتكر اول كلامنا واول مره حسينا اننا قريبين من بعض، ونبقى لسه بنحب نقعد نتكلم بالساعات حتى لو مفيش حاجه جديدة نحكيها، عشان بالنسبالي الحلو مش في عدد المواقف الحلوه قد ما هو في الشخص اللي بعيشها معاه، والشخص ده هو انت.", side: "right" },
  { image: "/4u-vintage-radio/assets/letter8.jpg", text: "وسط كل الناس اللي ممكن اقابلها وكل الحاجات اللي ممكن تحصل في يومي، انت ليك مكان مختلف عندي، مكان مش محتاج تثبتلي فيه كل يوم انك تستاهل حبي، عشان انا حبيتك من قلبي وبقيت بشوف فيك حاجات يمكن انت نفسك مش واخد بالك منها، وبحب تفاصيلك الصغيرة اللي يمكن محدش يلاحظها غيري، وبحب احساس ان فيه بينا حاجه تخصنا احنا وبس.", side: "right" },
  { image: "/4u-vintage-radio/assets/letter9.jpg", text: "لو سألتني ايه اللي نفسي فيه منك، هقولك نفسي في الصراحه والاهتمام واننا نفضل نتكلم مع بعض حتى لما الدنيا تبقى زحمه، نفسي لما حاجه تضايقك متبعدش عني من غير ما تقولي، ولما انا ازعل نعرف نرجع نتكلم ونفهم بعض، مش عايزه علاقه مفيهاش مشاكل، انا عايزه علاقه مهما حصل فيها نعرف نصلح ونتمسك ببعض عشان احنا الاتنين لسه عايزين بعض.", side: "right" },
  { image: "/4u-vintage-radio/assets/letter10.jpg",text: "بحبك يا حبيبي، وبحب انك انت بالذات الشخص اللي قلبي ارتاحله بالشكل ده، ومهما حاولت اشرحلك مكانتك عندي هحس ان الكلام قليل، انا مش عارفه بكرا مخبيلنا ايه بس عارفه انك بالنسبالي مش مجرد حد بحبه وخلاص، انت حد بتمنى اشوفه مبسوط وناجح ومرتاح، وبتمنى افضل موجوده في حياته اشاركه فرحته واسنده في وقت تعبه، وربنا يخليك ليا ويفضل اللي بينا حلو مهما عدت علينا ايام.", side: "right" },
];





function RadioModel({
  stage,
  onStation,
  onOpen,
  activeStation,
  heardStations,
}) {
  const radioRef = useRef();
  const bodyRef = useRef();
  const cameraPosition = useRef(new THREE.Vector3(0, 0, 9.5));
  const cameraLook = useRef(new THREE.Vector3(0, 0, 0));
  const { size } = useThree();

  useFrame(({ camera }, delta) => {
    if (!radioRef.current) return;

    const mobile = size.width <= 700;
    const intro = stage === "intro";
    const finale = stage === "finale" || stage === "notebook";

    // مكان الراديو قبل الفتح وبعده
    const targetPosition = intro
      ? mobile
        ? new THREE.Vector3(-0.7, -2.15, 0)
        : new THREE.Vector3(-3.35, -1.65, 0)
      : finale
        ? new THREE.Vector3(-8, -5, 0)
        : new THREE.Vector3(0, mobile ? -0.35 : -0.15, 0);

    // حجم الراديو قبل الفتح وبعده
    const targetScale = intro
      ? mobile
        ? 0.42
        : 0.52
      : finale
        ? 0.08
        : mobile
          ? 0.56
          : 1.05;

    radioRef.current.position.lerp(
      targetPosition,
      1 - Math.exp(-delta * 1.45)
    );

    radioRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.exp(-delta * 1.35)
    );

    const targetCameraZ = intro
      ? 9.5
      : finale
        ? 9.5
        : mobile
          ? 9.5
          : 5.8;

    cameraPosition.current.z = THREE.MathUtils.damp(
      cameraPosition.current.z,
      targetCameraZ,
      0.9,
      delta
    );

    camera.position.copy(cameraPosition.current);

    cameraLook.current.lerp(
      new THREE.Vector3(0, 0, 0),
      1 - Math.exp(-delta * 1.1)
    );

    camera.lookAt(cameraLook.current);

    // الراديو مستقيم بدون ميل أو دوران
    if (bodyRef.current) {
      bodyRef.current.rotation.set(0, 0, 0);
    }
  });

  const silver = "#c9cbd0";
  const dark = "#20232a";
  const blue = "#547dbb";

  return (
    <group
      ref={radioRef}
      position={
        size.width <= 700
          ? [-0.7, -2.15, 0]
          : [-3.35, -1.65, 0]
      }
      scale={size.width <= 700 ? 0.42 : 0.52}
      onClick={stage === "intro" ? onOpen : undefined}
    >
      <Float
        speed={stage === "intro" ? 0.7 : 0.25}
        rotationIntensity={0}
        floatIntensity={stage === "intro" ? 0.075 : 0.015}
      >
        <group ref={bodyRef}>
          {/* الجسم الرئيسي للكاسيت */}
          <RoundedBox
            args={[3.95, 2.75, 0.88]}
            radius={0.32}
            smoothness={20}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={blue}
              metalness={0.3}
              roughness={0.23}
            />
          </RoundedBox>

          {/* الجزء العلوي المنفصل */}
          <RoundedBox
            args={[3.9, 0.78, 0.12]}
            radius={0.24}
            smoothness={16}
            position={[0, 0.96, 0.43]}
          >
            <meshStandardMaterial
              color="#6288c3"
              metalness={0.28}
              roughness={0.23}
            />
          </RoundedBox>

          {/* خط الفصل */}
          <mesh position={[0, 0.53, 0.505]}>
            <boxGeometry args={[3.83, 0.025, 0.018]} />
            <meshStandardMaterial
              color="#294c7c"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>

          {/* الكتابة */}
          <Text
            position={[0, 1.03, 0.505]}
            fontSize={0.27}
            color="#101725"
            anchorX="center"
            anchorY="middle"
          >
            RETRO SOUND
          </Text>

          <Text
            position={[0, 0.79, 0.505]}
            fontSize={0.085}
            color="#18243a"
            anchorX="center"
            anchorY="middle"
          >
            OLD SCHOOL RETRO SOUND
          </Text>

          {/* الأزرار العلوية الأصلية */}
          {[-0.48, 0, 0.48].map((x, index) => (
            <RoundedBox
              key={index}
              args={[0.43, 0.22, 0.19]}
              radius={0.045}
              smoothness={10}
              position={[x, 1.39, 0.02]}
              castShadow
            >
              <meshStandardMaterial
                color={silver}
                metalness={0.65}
                roughness={0.23}
              />
            </RoundedBox>
          ))}

          {/* حلقة التعليق المعدنية */}
          <mesh
            position={[1.48, 1.43, -0.08]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.17, 0.035, 12, 40]} />
            <meshStandardMaterial
              color="#d5d6da"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>

          {/* الواجهة الفضية */}
          <RoundedBox
            args={[2.48, 1.8, 0.14]}
            radius={0.22}
            smoothness={20}
            position={[-0.35, -0.22, 0.49]}
            castShadow
          >
            <meshStandardMaterial
              color="#c9cbd0"
              metalness={0.48}
              roughness={0.3}
            />
          </RoundedBox>

          {/* الحافة الداخلية */}
          <RoundedBox
            args={[2.31, 1.64, 0.035]}
            radius={0.19}
            smoothness={16}
            position={[-0.35, -0.22, 0.575]}
          >
            <meshStandardMaterial
              color="#e0e0e2"
              metalness={0.25}
              roughness={0.34}
            />
          </RoundedBox>

          {/* خلفية السماعتين */}
          <RoundedBox
            args={[1.97, 0.85, 0.045]}
            radius={0.28}
            smoothness={16}
            position={[-0.35, -0.2, 0.61]}
          >
            <meshStandardMaterial
              color={dark}
              metalness={0.55}
              roughness={0.27}
            />
          </RoundedBox>

          {/* السماعتان */}
          {[-0.91, 0.21].map((x, index) => (
            <group key={index} position={[x, -0.2, 0.66]}>
              <mesh>
                <cylinderGeometry args={[0.37, 0.37, 0.12, 64]} />
                <meshStandardMaterial
                  color="#12151c"
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>

              <mesh position={[0, 0, 0.065]}>
                <ringGeometry args={[0.285, 0.335, 64]} />
                <meshStandardMaterial
                  color="#777b84"
                  metalness={0.9}
                  roughness={0.18}
                />
              </mesh>

              <mesh position={[0, 0, 0.075]}>
                <circleGeometry args={[0.28, 64]} />
                <meshStandardMaterial
                  color="#090c12"
                  metalness={0.65}
                  roughness={0.16}
                />
              </mesh>

              <mesh position={[0, 0, 0.09]}>
                <circleGeometry args={[0.115, 48]} />
                <meshStandardMaterial
                  color="#426da9"
                  metalness={0.85}
                  roughness={0.14}
                  emissive="#14294c"
                  emissiveIntensity={0.2}
                />
              </mesh>

              <mesh
                position={[-0.055, 0.065, 0.105]}
                scale={[1, 0.55, 1]}
              >
                <circleGeometry args={[0.035, 24]} />
                <meshBasicMaterial color="#dceaff" />
              </mesh>
            </group>
          ))}

          {/* فتحة الكاسيت السفلية */}
          <RoundedBox
            args={[1.35, 0.12, 0.055]}
            radius={0.035}
            smoothness={8}
            position={[-0.35, -1.2, 0.46]}
          >
            <meshStandardMaterial
              color="#252a33"
              metalness={0.45}
              roughness={0.3}
            />
          </RoundedBox>

          <mesh position={[-0.35, -1.2, 0.493]}>
            <boxGeometry args={[1.12, 0.025, 0.012]} />
            <meshBasicMaterial color="#69717e" />
          </mesh>

          {/* أزرار تشغيل التسجيلات */}
          {STATIONS.map((station, index) => {
            const selected = activeStation === index;
            const heard = heardStations.includes(index);

            return (
              <group
                key={station.number}
                position={[-0.48 + index * 0.48, 1.39, 0.16]}
                onClick={(event) => {
                  event.stopPropagation();

                  if (stage === "radio") {
                    onStation(index);
                  }
                }}
              >
                <RoundedBox
                  args={[0.43, 0.22, 0.19]}
                  radius={0.045}
                  smoothness={10}
                  position={[0, 0, -0.035]}
                >
                  <meshStandardMaterial
                    color="#9299a5"
                    metalness={0.65}
                    roughness={0.23}
                  />
                </RoundedBox>

                <RoundedBox
                  args={[0.36, 0.12, 0.16]}
                  radius={0.035}
                  smoothness={10}
                  position={[0, selected ? 0.035 : 0, 0.035]}
                >
                  <meshStandardMaterial
                    color={
                      selected
                        ? "#a9dfc0"
                        : heard
                          ? "#d6e5f8"
                          : "#e0e1e4"
                    }
                    metalness={0.5}
                    roughness={0.22}
                    emissive={selected ? "#426b57" : "#000000"}
                    emissiveIntensity={selected ? 0.25 : 0}
                  />
                </RoundedBox>
              </group>
            );
          })}

          {/* الزر الجانبي الفضي */}
          <RoundedBox
            args={[0.19, 0.95, 0.2]}
            radius={0.075}
            smoothness={16}
            position={[1.94, -0.12, 0.03]}
            castShadow
          >
            <meshStandardMaterial
              color="#d6d8dc"
              metalness={0.72}
              roughness={0.2}
            />
          </RoundedBox>

          <RoundedBox
            args={[0.08, 0.73, 0.035]}
            radius={0.035}
            smoothness={10}
            position={[1.94, -0.12, 0.14]}
          >
            <meshStandardMaterial
              color="#f2f2f4"
              metalness={0.45}
              roughness={0.2}
            />
          </RoundedBox>

          {/* البراغي */}
          {[
            [-1.82, 1.1],
            [1.82, 1.1],
            [-1.82, -1.08],
            [1.82, -1.08],
          ].map(([x, y], index) => (
            <mesh key={index} position={[x, y, 0.45]}>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 20]} />
              <meshStandardMaterial
                color="#d8dbe0"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
          ))}

          {/* الحلقة الجانبية */}
          <mesh
            position={[2.02, 0.48, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.1, 0.025, 10, 32]} />
            <meshStandardMaterial
              color="#d4d6da"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}





export default function App() {
  const [stage, setStage] = useState("intro");
const [visibleLine, setVisibleLine] = useState(-1);
const [finaleReady, setFinaleReady] = useState(false);
  const [activeStation, setActiveStation] = useState(-1);
  const [heardStations, setHeardStations] = useState([]);
  const [showPicture, setShowPicture] = useState(false);
  const [warning, setWarning] = useState("");
  const [playing, setPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const audioRef = useRef(null);
  const progressTimer = useRef(null);
  const pictureTimer = useRef(null);

useEffect(() => {
  if (stage !== "intro") return;

  const timers = [
    setTimeout(() => setVisibleLine(0), 2000),
    setTimeout(() => setVisibleLine(1), 3700),
    setTimeout(() => setVisibleLine(2), 5400),
    setTimeout(() => setVisibleLine(3), 7100),
    setTimeout(() => setVisibleLine(4), 8800),
  ];

  return () => timers.forEach(clearTimeout);
}, [stage]);

useEffect(() => {
  if (stage !== "finale") {
    setFinaleReady(false);
    return;
  }

  setFinaleReady(false);

  const timer = setTimeout(() => {
    setFinaleReady(true);
  }, 5700);

  return () => clearTimeout(timer);
}, [stage]);

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
      if (pictureTimer.current) clearTimeout(pictureTimer.current);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

function openRadio() {
  if (stage !== "intro") return;
  if (visibleLine < 4) return;

  setStage("radio");
}

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }

    if (pictureTimer.current) {
      clearTimeout(pictureTimer.current);
      pictureTimer.current = null;
    }

    setPlaying(false);
    setShowPicture(false);
    setAudioProgress(0);
  }

  function playStation(index) {
    const station = STATIONS[index];
    if (!station) return;

    stopAudio();
    setActiveStation(index);
    setWarning("");
    setShowPicture(true);

    const audio = new Audio(station.audio);
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setHeardStations((old) =>
        old.includes(index) ? old : [...old, index]
      );

      setPlaying(false);
      setAudioProgress(100);

      pictureTimer.current = setTimeout(() => {
        setShowPicture(false);
      }, 550);

      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }

      audioRef.current = null;
    });

    audio.addEventListener("error", () => {
      setWarning(
        `ملف صوت المحطة ${station.number} مش موجود أو مش قادر يشتغل`
      );
      setPlaying(false);
      setShowPicture(false);
    });

    audio
      .play()
      .then(() => {
        setPlaying(true);

        progressTimer.current = setInterval(() => {
          if (!audio.duration || !Number.isFinite(audio.duration)) return;

          setAudioProgress(
            (audio.currentTime / audio.duration) * 100
          );
        }, 100);
      })
      .catch(() => {
        setWarning(
          `مش قادر أشغّل تسجيل المحطة ${station.number}. راجع ملف الصوت.`
        );
        setShowPicture(false);
        setPlaying(false);
      });
  }

  function showFinalSurprise() {
    const missing = STATIONS
      .filter((station, index) => !heardStations.includes(index))
      .map((station) => station.number);

    if (missing.length) {
      setWarning(
        `متنصبش إنت لسه مسمعتش ${missing.map((number) => `المحطة ${number}`).join(" و ")}`
      );
      return;
    }

    stopAudio();
    setWarning("");
    setStage("finale");
  }

  return (
    <main className={`experience stage-${stage}`}>
      <div className="paper-grain" />

      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 9.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.15} />

        <directionalLight
          position={[3, 6, 7]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <pointLight
          position={[-4, 3, 4]}
          intensity={1.15}
          color="#ffdce5"
        />

        <pointLight
          position={[4, -2, 2]}
          intensity={0.65}
          color="#c4e8ff"
        />

        <Environment preset="studio" />

        <RadioModel
          stage={stage}
          onStation={playStation}
          onOpen={openRadio}
          activeStation={activeStation}
          heardStations={heardStations}
        />

        <ContactShadows
          position={[-2.7, -2.05, -0.1]}
          opacity={0.28}
          scale={7}
          blur={2.6}
          far={4}
        />
      </Canvas>

      {stage === "intro" && (
<section className="intro-copy" dir="rtl">
  <div className={`intro-line line-one ${visibleLine >= 0 ? "shown" : ""}`}>
    إيه الراديو ده؟
  </div>

<div
  className={`intro-line red-line ${visibleLine >= 1 ? "shown" : ""}`}
  style={{ color: "#d62845" }}
>
  مش عارف
</div>

  <div className={`intro-line ${visibleLine >= 2 ? "shown" : ""}`}>
طب وبعدين
  </div>

<div
  className={`intro-line red-line ${visibleLine >= 3 ? "shown" : ""}`}
  style={{ color: "#d62845" }}
>
  متيجي نشوفه
</div>
<div className={`intro-line ${visibleLine >= 4 ? "shown" : ""}`}>
دوس عليه كده
</div>
</section>
      )}

      {stage === "radio" && (
        <>
          <div className="radio-heading">
            <span className="tiny-label">A LITTLE PIECE OF MEMORY</span>
            <h1>
            دوس ع الزراير عشان تحول بين المحطات<span></span>
            </h1>
     {/*       <p>كل رقم وراه حكاية صغيرة مستنياك تسمعها</p>*/} 
          </div>

          {showPicture && activeStation >= 0 && (
            <div
              className={`old-tv-picture ${
                playing ? "picture-on" : ""
              }`}
            >
              <div className="tv-static" />

              <img
                src={STATIONS[activeStation].image}
                alt={`صورة المحطة ${STATIONS[activeStation].number}`}
                onError={(event) => {
                  event.currentTarget.style.opacity = "0";
                }}
              />

              <div className="tv-scanlines" />

              <div className="picture-caption">
                STATION {STATIONS[activeStation].number}
              </div>
            </div>
          )}

          <div className="station-status">
            {playing && activeStation >= 0
              ? `شغّالين على المحطة ${STATIONS[activeStation].number} ♥`
              : ""}
          </div>

          <div className="audio-progress">
            <span style={{ width: `${audioProgress}%` }} />
          </div>

<button className="surprise-button" onClick={showFinalSurprise}>
  {heardStations.length === STATIONS.length
    ? "شاطر دوس هنا بقى"
    : "اسمع كل التسجيلات ودوس هنا"}
  <span>✦</span>
</button>

          <div className="heard-counter">
            سمعت {heardStations.length} من {STATIONS.length} محطات
          </div>
        </>
      )}


{stage === "finale" && (
  <div className="finale-copy" dir="rtl">
    <div className="finale-lines">
      <p className="finale-black">
        وبعدين في الشغلانة دي
      </p>

      <p className="finale-red">
        هو هيفضل يمرمطنا كده؟
      </p>

      <p className="finale-black">
        هدية إيه تاني؟
      </p>

      <p className="finale-red">
        إيه الورقة دي؟
      </p>

      <p className="finale-black">
        دوس عليها كده
      </p>
    </div>

    <div
      className="paper-teaser paper-clickable"
      role="button"
      tabIndex={0}
      aria-label="افتح الورقة"
onClick={() => {
  setStage("notebook");
  window.scrollTo({ top: 0, behavior: "instant" });
}}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setStage("notebook");
window.scrollTo({ top: 0, behavior: "instant" });
        }
      }}
    >
      <div className="teaser-lines">
        <span />
        <span />
        <span />
        <span />
      </div>

      <span className="paper-heart">♥</span>
    </div>
  </div>
)}


      {stage === "notebook" && (
        <section className="notebook-scene">
          <div className="notebook-top">
            <span>JUST FOR YOU</span>
            <h2>شريط حياتنا</h2>
          </div>

          <article className="notebook-paper">
            <div className="notebook-margin" />

            {LETTER_LINES.map((line, index) => (
              <div
                key={`${line.image}-${index}`}
                className={`letter-row ${
                  line.side === "right" ? "image-right" : ""
                } ${index === 5 ? "second-group" : ""}`}
              >
                <div className="letter-photo">
                  <img
                    src={line.image}
                    alt={`صورة الرسالة ${index + 1}`}
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>
                <p>{line.text}</p>
              </div>
            ))}
          </article>

          <p className="notebook-signature">
            made by 4U
          </p>
        </section>
      )}

      {warning && (
        <div className="warning-toast" role="status">
          <span>♡</span>
          {warning}
          <button onClick={() => setWarning("")} aria-label="إغلاق">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
