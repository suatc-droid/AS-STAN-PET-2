import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  Plus, 
  HelpCircle, 
  X, 
  Zap, 
  Coffee, 
  Volume2, 
  VolumeX, 
  Settings,
  Mic,
  MicOff,
  Minimize2, 
  Maximize2, 
  EyeOff,
  Pencil,
  Check,
  CheckCircle,
  ShieldAlert,
  Heart,
  Award,
  BookOpen,
  Smile,
  Cloud,
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  Activity,
  Newspaper,
  Mail,
  StickyNote,
  Trash2,
  Star,
  FileText,
  PenTool,
  Copy
} from 'lucide-react';
import { WorkflowTemplate, ActiveStep } from '../types';

export interface StickyTask {
  id: string;
  text: string;
  carryType: 'mouth_envelope' | 'head_postit';
  durationMins: number;
  createdAt: number;
  remindAt: number | null;
  notified: boolean;
  completed: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Genel Mevzuat' | 'İzin Hakları' | 'Sözleşmeli Personel' | 'Sağlık Mevzuatı' | 'Disiplin Mevzuatı' | 'Mali Haklar' | 'Emeklilik İşlemleri';
}

interface LegislationTopic {
  id: string;
  title: string;
  summary: string;
  details: string[];
  lawNo?: string;
  tags: string[];
  pdfUrl?: string;
  additionalPdfs?: { label: string; url: string; }[];
}

const legislationLibrary: LegislationTopic[] = [
  {
    id: 'dmk-temel',
    title: '657 DMK Temel İlkeler',
    summary: 'Devlet memurlarının hizmet şartlarını, niteliklerini, atanma ve yetiştirilmelerini, ilerleme ve yükselmelerini düzenleyen temel kanun.',
    details: [
      'Md. 3/A - Sınıflandırma: Görevlerin gerektirdiği niteliklere göre memurları sınıflara ayırmaktır.',
      'Md. 3/B - Kariyer: Memurlara, sınıfları içinde en yüksek derecelere kadar ilerleme imkanı sağlamaktır.',
      'Md. 3/C - Liyakat: Kamu hizmetine girmeyi ve yükselmeyi yetenek ve başarı esasına dayandırmaktır.'
    ],
    lawNo: '657 Sayılı Kanun Madde 3',
    tags: ['Genel', 'Kariyer', 'Liyakat']
  },
  {
    id: 'yillik-izin',
    title: 'Yıllık İzin Hakları (Genel)',
    summary: 'Hizmet süresine göre memurların kullanabileceği dinlenme süreleri ve kullanım usulleri.',
    details: [
      'Md. 102 - Süre: Hizmeti 1-10 yıl olanlara 20 gün, 10 yıldan fazla olanlara 30 gün izin verilir.',
      'Md. 103 - Kullanım: İzinler amirin uygun bulacağı zamanlarda kullanılır. İki yılın izni birleştirilebilir.',
      'Önemli: Cari yıl ile bir önceki yıl hariç, önceki yıllara ait izinler devretmez ve yanar.'
    ],
    lawNo: '657 DMK Md. 102-103',
    tags: ['İzin', 'Sosyal Haklar']
  },
  {
    id: 'mazeret-izinleri',
    title: 'Mazeret İzinleri',
    summary: 'Doğum, evlenme, ölüm ve diğer özel durumlarda verilen ücretli izin hakları.',
    details: [
      'Md. 104/A - Doğum: Kadın memura doğum öncesi 8, sonrası 8 hafta (toplam 16 hafta) izin verilir.',
      'Md. 104/B - Babalık/Evlilik/Ölüm: Eşi doğum yapan memura, kendisinin veya çocuğunun evlenmesi, yakın ölümü hallerinde 7 gün izin verilir.',
      'Md. 104/D - Süt İzni: İlk 6 ay günde 3 saat, ikinci 6 ay günde 1.5 saat süt izni verilir.'
    ],
    lawNo: '657 DMK Md. 104',
    tags: ['Mazeret', 'İzin', 'Aile']
  },
  {
    id: 'hastalik-refakat',
    title: 'Hastalık ve Refakat İzni',
    summary: 'Memurun kendisinin veya bakmakla yükümlü olduğu kişilerin hastalık durumlarındaki hakları.',
    details: [
      'Md. 105 - Refakat: Bakmakla yükümlü olunan kişinin ağır kaza/hastalığı halinde 3 aya kadar izin verilir.',
      'Md. 105 - Hastalık: On yıla kadar hizmeti olanlara 6 aya kadar, on yıldan fazla olanlara 12 aya kadar rapor verilebilir.',
      'Kanser, verem, akıl hastalığı gibi uzun süreli tedavilerde izin süresi 18 aya kadar çıkabilir.'
    ],
    lawNo: '657 DMK Md. 105',
    tags: ['Sağlık', 'Rapor', 'İzin']
  },
  {
    id: 'disiplin-cezalari',
    title: 'Disiplin Cezaları Türleri',
    summary: 'Hizmetin işleyişini bozan fiillere karşı uygulanan yasal yaptırımlar.',
    details: [
      'Md. 125/A - Uyarma: Görevde daha dikkatli olunması gerektiğinin yazı ile bildirilmesidir.',
      'Md. 125/B - Kınama: Görevde kusurlu olduğunun yazı ile bildirilmesidir.',
      'Md. 125/C - Aylıktan Kesme: Brüt aylıktan 1/30 - 1/8 oranında kesinti yapılmasıdır.',
      'Md. 125/D - Kademe İlerlemesinin Durdurulması: İlerlemenin 1 - 3 yıl süreyle durdurulmasıdır.'
    ],
    lawNo: '657 DMK Md. 125',
    tags: ['Disiplin', 'Soruşturma']
  },
  {
    id: '4b-esaslar',
    title: '4/B Sözleşmeli Personel Esasları',
    summary: 'Sözleşmeli personelin çalışma şartlarını belirleyen Bakanlar Kurulu Kararı hükümleri.',
    details: [
      'Ek Madde 3 - İzin Devri: Sözleşmeli personelin yıllık izinleri, bir sonraki yıla devredilebilir (Güncel düzenleme).',
      'Md. 9 - Fesih: Sözleşme hükümlerine aykırı davranılması halinde kurumca tek taraflı fesih yapılabilir.',
      'Hizmet Sözleşmesi: Personel her yıl mali yıl başında yeniden hizmet sözleşmesi imzalar.'
    ],
    lawNo: 'BKK 7/15754 Sayılı Esaslar',
    tags: ['Sözleşmeli', '4/B']
  },
  {
    id: 'saglik-atama',
    title: 'Sağlık Personeli Atama Yönetmeliği',
    summary: 'Sağlık Bakanlığı bünyesinde görev yapan personelin yer değiştirme ve tayin kriterleri.',
    details: [
      'Md. 16 - Stratejik Personel: Uzman tabip, tabip gibi unvanlar Bakanlıkça stratejik personel olarak tanımlanır.',
      'Md. 19 - Eş Durumu: Eşi kamu görevlisi olanların atama talepleri, hizmet puanı ve kadro uygunluğuna göre değerlendirilir.',
      'Md. 26 - Becayiş: Aynı unvan ve branşta çalışanların karşılıklı yer değiştirme taleplerini düzenler.'
    ],
    lawNo: 'Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği',
    tags: ['Tayin', 'Atama', 'Sağlık'],
    pdfUrl: '/mevzuat/atama_yonetmelik.pdf'
  },
  {
    id: '4924-kanun',
    title: '4924 Sayılı Kanun (Sözleşmeli Sağlık Personeli)',
    summary: 'Eleman temininde güçlük çekilen yerlerde sözleşmeli sağlık personeli istihdamını düzenleyen kanun.',
    details: [
      'Md. 1 - Amaç: Sağlık hizmetlerinin sürekliliğini sağlamak için belirli bölgelerde sözleşmeli personel istihdamıdır.',
      'Md. 3 - Sözleşme: Personel ile her yıl mali yıl itibarıyla hizmet sözleşmesi yapılır.',
      'Tayin Kısıtı: Bu kanun kapsamındaki personel, eş durumu ve sağlık mazereti hariç sözleşme süresince tayin isteyemez.',
      'Ücret: 4924 sayılı Kanuna tabi personele, emsali devlet memurundan daha yüksek ek ödeme ve ücret verilebilir.'
    ],
    lawNo: '4924 Sayılı Kanun',
    tags: ['4924', 'Sağlık', 'Sözleşmeli'],
    pdfUrl: '/mevzuat/4924_yonetmelik.pdf',
    additionalPdfs: [
      { label: '4924 Genelge', url: '/mevzuat/4924_genelge.pdf' }
    ]
  },
  {
    id: 'surekli-isci',
    title: 'Sürekli İşçi Mevzuatı (2025-2026 TİS)',
    summary: 'Sağlık Bakanlığı ve Öz Sağlık-İş arasında 28.08.2025 tarihinde imzalanan güncel Toplu İş Sözleşmesi hükümleri.',
    details: [
      'Md. 30/a - Yıllık İzin: Hizmeti 1-10 yıl olanlara 20 gün, 10 yıldan fazla olanlara 30 gün ücretli izin verilir.',
      'Md. 30/d - Mazeret İzni: Evlilik, doğum (eşin) ve yakın ölümü hallerinde 5 iş günü; tabii afetlerde 7 iş günü izin verilir.',
      'Md. 33 - Ücret: 01.01.2025 itibarıyla taban ücret 1.400 TL/Gün + 40 TL/Gün seyyanen zam uygulanır.',
      'Md. 20 - Mesai: Haftalık çalışma süresi 45 saattir. İşyerinin özelliğine göre 5 veya 6 gün olarak uygulanabilir.'
    ],
    lawNo: '2025-2026 Öz Sağlık-İş İşletme TİS',
    tags: ['İşçi', 'TİS', '2025', 'İzin'],
    pdfUrl: '/mevzuat/isci_tis_2025.pdf'
  }
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "657 Sayılı Devlet Memurları Kanunu'na göre mazeretsiz ve kesintisiz kaç gün göreve gelmeyen memur müstafi (çekilmiş) sayılır?",
    options: ["5 gün", "7 gün", "10 gün", "15 gün"],
    correctIndex: 2,
    explanation: "657 DMK Md. 94 uyarınca izinsiz veya özürsüz kesintisiz 10 gün görevini terk eden memur müstafi sayılır.",
    category: "Genel Mevzuat"
  },
  {
    question: "Doğum yapan kadın memura doğum sonrası ilk altı ayda günde kaç saat süt izni verilir?",
    options: ["1 saat", "1.5 saat", "2 saat", "3 saat"],
    correctIndex: 3,
    explanation: "657 DMK Md. 104/D uyarınca doğum sonrası ilk altı ayda günde 3 saat, ikinci altı ayda ise günde 1.5 saat süt izni verilir.",
    category: "İzin Hakları"
  },
  {
    question: "Sözleşmeli personelin (4/B) kullanılmayan yıllık izinleri hakkında hangisi doğrudur?",
    options: ["Sonraki yıla devreder", "Sonraki yıla devredemez, yanar", "Para iadesi yapılır", "Ertesi yıla sadece yarısı devreder"],
    correctIndex: 1,
    explanation: "Sözleşmeli Personel Çalıştırılmasına İlişkin Esaslar gereğince 4/B personelin yıllık izni takvim yılı sonunda yanar, sonraki yıla devretmez.",
    category: "Sözleşmeli Personel"
  },
  {
    question: "Sağlık personeline her yıl yıllık izinlerine ek olarak verilen ücretli şua izni kaç gündür?",
    options: ["10 gün", "15 gün", "20 gün", "30 gün"],
    correctIndex: 3,
    explanation: "Radyasyonla çalışan sağlık personeline her yıl yıllık izinlerine ilaveten 30 gün ücretli sağlık izni (şua izni) verilmesi yasal bir zorunluluktur.",
    category: "Sağlık Mevzuatı"
  },
  {
    question: "657 DMK'ya göre aday memurluk süresi en fazla ne kadar olabilir?",
    options: ["6 ay", "1 yıl", "2 yıl", "3 yıl"],
    correctIndex: 2,
    explanation: "657 DMK Md. 54 uyarınca aday memurluk süresi asgari 1 yıl, azami 2 yıl olabilir.",
    category: "Genel Mevzuat"
  },
  {
    question: "Kamu görevlilerinin mal bildirimi beyanlarını sonu hangi rakamlarla biten yıllarda yenilemeleri zorunludur?",
    options: ["Her yıl", "Tek yıllar", "(0) ve (5) ile biten", "Çift yıllar"],
    correctIndex: 2,
    explanation: "3628 Sayılı Kanun Md. 6 gereğince mal bildirimleri sonu (0) ve (5) ile biten yıllarda en geç Şubat ayı sonuna kadar yenilenmelidir.",
    category: "Genel Mevzuat"
  },
  {
    question: "Memurun bakmakla yükümlü olduğu veya hayatı tehlikeye girecek derece ağır kaza/uzun tedavi gerektiren hastalık durumlarında sağlık kurulu raporu ile en fazla kaç aya kadar refakat izni verilebilir?",
    options: ["1 ay", "2 ay", "3 ay", "6 ay"],
    correctIndex: 2,
    explanation: "657 DMK Md. 105 uyarınca refakat izni sağlık kurulu raporu şartıyla 3 aya kadar verilir ve en fazla toplamda 6 aya kadar uzatılabilir.",
    category: "İzin Hakları"
  },
  {
    question: "Devlet memuruna; kendisinin veya çocuğunun evlenmesi ya da birinci derece yakınlarının ölümü halinde kaç gün mazeret izni verilir?",
    options: ["3 gün", "5 gün", "7 gün", "10 gün"],
    correctIndex: 2,
    explanation: "657 DMK Md. 104/B uyarınca memura evlenme ve vefat hallerinde isteği üzerine 7 gün mazeret izni verilir.",
    category: "İzin Hakları"
  },
  {
    question: "Disiplin amiri, disiplin suçu teşkil eden eylemi öğrendikten sonra en geç kaç ay içinde soruşturma başlatmak zorundadır, aksi takdirde ceza verme yetkisi zamanaşımına uğrar?",
    options: ["1 ay", "3 ay", "6 ay", "1 yıl"],
    correctIndex: 0,
    explanation: "657 DMK Md. 127 uyarınca disiplin amiri eylemi öğrendiği tarihten itibaren en geç 1 ay içinde soruşturmaya başlamalıdır.",
    category: "Genel Mevzuat"
  },
  {
    question: "Hizmet süresi 10 yıldan fazla olan memur veya sağlık çalışanlarının yıllık izin süresi kaç gündür?",
    options: ["15 gün", "20 gün", "25 gün", "30 gün"],
    correctIndex: 3,
    explanation: "657 DMK Md. 102 uyarınca hizmeti 1 yıldan 10 yıla kadar olanların 20 gün, 10 yıldan fazla olanların ise 30 gün yıllık izni vardır.",
    category: "İzin Hakları"
  },
  {
    question: "Eşinin doğum yapması durumunda erkek memura isteği üzerine kaç gün mazeret (babalık) izni verilir?",
    options: ["3 gün", "5 gün", "7 gün", "10 gün"],
    correctIndex: 3,
    explanation: "657 DMK Md. 104/B uyarınca eşi doğum yapan memura isteği üzerine 10 gün babalık izni verilmesi yasal haktır.",
    category: "İzin Hakları"
  },
  {
    question: "Memurluktan usulüne uygun şekilde istifa (çekilme) eden bir kişi, istifa tarihinden itibaren en az kaç ay geçmeden tekrar memurluğa atanamaz?",
    options: ["3 ay", "6 ay", "1 yıl", "2 yıl"],
    correctIndex: 1,
    explanation: "657 DMK Md. 97 uyarınca usulüne uygun istifa edenler 6 ay, usulüne uymadan görevden ayrılanlar ise 1 yıl geçmeden memurluğa geri dönemez.",
    category: "Genel Mevzuat"
  },
  {
    question: "Hangisi memurlara verilen disiplin cezalarından biri değildir?",
    options: ["Uyarma", "Görevden Uzaklaştırma", "Kınama", "Aylıktan Kesme"],
    correctIndex: 1,
    explanation: "Görevden uzaklaştırma bir disiplin cezası değil, bir ihtiyati tedbirdir. Disiplin cezaları: Uyarma, kınama, aylıktan kesme, kademe ilerlemesinin durdurulması ve ihraçtır.",
    category: "Disiplin Mevzuatı"
  },
  {
    question: "Kademe ilerlemesinin durdurulması cezası alan bir memurun, bulunduğu kademede ilerlemesi en az kaç yıl durdurulur?",
    options: ["6 ay", "1 yıl", "2 yıl", "3 yıl"],
    correctIndex: 1,
    explanation: "657 DMK Md. 125 uyarınca kademe ilerlemesinin durdurulması cezası fiilin ağırlığına göre 1 yıldan 3 yıla kadar uygulanır.",
    category: "Disiplin Mevzuatı"
  },
  {
    question: "Aşağıdakilerden hangisi memurların mali haklarından biri olan 'Ek Gösterge'nin temel işlevidir?",
    options: ["Günlük harcırahı belirlemek", "Maaşın %50'sini oluşturmak", "Emekli aylığı ve ikramiyesini belirlemek", "Yıllık izin süresini artırmak"],
    correctIndex: 2,
    explanation: "Ek gösterge, memurların özellikle emekli aylığı ve emekli ikramiyesi tutarlarını doğrudan ve önemli ölçüde etkileyen bir unsurdur.",
    category: "Mali Haklar"
  },
  {
    question: "Emekli sandığına tabi bir memurun emekliliğe hak kazanabilmesi için gerekli olan 'Fiili Hizmet Süresi' asgari ne kadardır (Genel kural)?",
    options: ["15 yıl", "20 yıl", "25 yıl", "30 yıl"],
    correctIndex: 2,
    explanation: "Genel olarak memurların emeklilik hak aylığına kavuşabilmeleri için 25 fiili hizmet yılını (kadınlarda eskiden 20 idi, güncelde genel şart 25'tir) tamamlamaları esastır.",
    category: "Emeklilik İşlemleri"
  },
  {
    question: "Disiplin cezalarına karşı yapılacak itirazlarda süre, kararın ilgiliye tebliğinden itibaren kaç gündür?",
    options: ["7 gün", "15 gün", "30 gün", "60 gün"],
    correctIndex: 0,
    explanation: "657 DMK Md. 135 uyarınca disiplin cezalarına karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.",
    category: "Disiplin Mevzuatı"
  },
  {
    question: "Aylıktan kesme cezası, memurun brüt aylığından hangi oranlar arasında yapılır?",
    options: ["1/10 - 1/5", "1/20 - 1/10", "1/30 - 1/8", "1/50 - 1/25"],
    correctIndex: 2,
    explanation: "657 DMK Md. 125/C uyarınca aylıktan kesme cezası memurun brüt aylığından 1/30 - 1/8 arasında yapılır.",
    category: "Disiplin Mevzuatı"
  }
];

interface ExerciseStep {
  text: string;
  duration: number;
}

const eyeExerciseSteps: ExerciseStep[] = [
  { text: "Gözlerinizi sıkıca kapatın ve 5 saniye dinlendirin. 😌", duration: 5 },
  { text: "Gözlerinizi açın. Başınızı kıpırdatmadan sadece gözlerinizle en sağa bakın. 👀👉", duration: 5 },
  { text: "Şimdi başınızı oynatmadan sadece gözlerinizle en sola bakın. 👈👀", duration: 5 },
  { text: "Gözlerinizi hızlıca 10 kez kırpıştırın. 👁️⚡", duration: 5 },
  { text: "Ufka veya odanın en uzak noktasına 10 saniye odaklanın. 🌅", duration: 10 },
  { text: "Harika! Gözleriniz tazelendi. Enerjiniz arttı! 🔋✨", duration: 0 }
];

const stretchExerciseSteps: ExerciseStep[] = [
  { text: "Yavaşça başınızı sağa yatırın ve omuz esnemesini hissedin. 🧘‍♂️", duration: 5 },
  { text: "Yavaşça başınızı sola yatırın ve 5 saniye bekleyin. 🧘‍♀️", duration: 5 },
  { text: "Sırtınızı dikleştirip omuzlarınızı dairesel olarak arkaya doğru yuvarlayın. 🌀", duration: 5 },
  { text: "Kollarınızı yukarı uzatıp gökyüzüne uzanır gibi esneyin. 🙆‍♂️", duration: 8 },
  { text: "Mükemmel! Kaslarınız gevşedi ve dolaşımınız hızlandı! 💪⚡", duration: 0 }
];

const postureExerciseSteps: ExerciseStep[] = [
  { text: "Sırtınızı dikleştirin, omuzlarınızı geriye yuvarlayın ve göğsünüzü açın. 📐", duration: 5 },
  { text: "Derin bir nefes alın (4 saniye): Al, al, al... 💨", duration: 4 },
  { text: "Nefesinizi tutun (4 saniye): Tut, tut, tut... ⏱️", duration: 4 },
  { text: "Yavaşça ağzınızdan verin (6 saniye): Ver, ver, ver... 🍃", duration: 6 },
  { text: "Süper! Doğru duruş ve solunum beyninize giden oksijeni artırdı! 🧠✨", duration: 0 }
];

interface RegulatoryFeedItem {
  id: number;
  date: string;
  source: string;
  title: string;
  summary: string;
  isCritical: boolean;
  link: string;
}

const regulatoryFeedItems: RegulatoryFeedItem[] = [
  {
    id: 1,
    date: "07.07.2026",
    source: "Resmî Gazete - Sayı: 32612",
    title: "Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliğinde Değişiklik",
    summary: "Eş durumu mazeret tayinlerinde istenen prim gün sayısı ve belge şartları güncellendi. Deprem bölgesi kadrolarına atanan personel için ek mazeret hakları tanımlandı.",
    isCritical: true,
    link: "https://www.resmigazete.gov.tr/"
  },
  {
    id: 2,
    date: "06.07.2026",
    source: "Sağlık Bakanlığı - Yönetim Hizmetleri Genel Müdürlüğü",
    title: "2026 Yılı 2. Dönem İlk Defa ve Yeniden Atama Kurası İlanı",
    summary: "Uzman hekim, uzman diş tabibi, tabip, diş tabibi ve eczacı kadroları için başvurular başladı. Son başvuru tarihi 15 Temmuz.",
    isCritical: false,
    link: "https://yhgm.saglik.gov.tr/"
  },
  {
    id: 3,
    date: "05.07.2026",
    source: "Resmî Gazete - Sayı: 32610",
    title: "657 Sayılı Kanun Kapsamında Yeni Enflasyon Farkı ve Katsayı Düzenlemesi",
    summary: "Memur maaş katsayıları ve yan ödeme kararnamesi yürürlüğe girdi. 15 Temmuz itibarıyla geçerli olacak kıst maaş katsayı tablosu açıklandı.",
    isCritical: true,
    link: "https://www.resmigazete.gov.tr/"
  },
  {
    id: 4,
    date: "02.07.2026",
    source: "Anayasa Mahkemesi Kararı",
    title: "Yıllık İzin Sürelerinin Bölünmesine İlişkin Karar",
    summary: "AYM, sözleşmeli personelin yıllık izinlerinin bölümler halinde kullanılmasına dair yönetmelik kısıtlamasını iptal ederek esneklik getirdi.",
    isCritical: false,
    link: "https://www.resmigazete.gov.tr/"
  }
];

interface DesktopRobotProps {
  setIsAssistantOpen: (open: boolean) => void;
  openNewTemplateModal: () => void;
  workflows: WorkflowTemplate[];
  onStartWorkflow: (wf: WorkflowTemplate) => void;
  isStandalone?: boolean;
  activeStep?: ActiveStep | null;
}

type RobotState = 'idle' | 'happy' | 'thinking' | 'waving' | 'sleepy' | 'surprised';

const JoyParticles = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden rounded-full">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            x: [`${50}%`, `${50 + (Math.random() * 120 - 60)}%`],
            y: [`${50}%`, `${50 + (Math.random() * 120 - 60)}%`],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          className="absolute w-3 h-3 text-yellow-400"
        >
          <Sparkles size={12} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
        </motion.div>
      ))}
    </div>
  );
};

export function DesktopRobot({ 
  setIsAssistantOpen, 
  openNewTemplateModal, 
  workflows, 
  onStartWorkflow,
  isStandalone = false,
  activeStep = null
}: DesktopRobotProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const getFontClass = (type: 'bubble' | 'title' | 'options') => {
    if (type === 'bubble') {
      if (fontSizeMode === 'normal') return 'text-xs';
      if (fontSizeMode === 'large') return 'text-sm';
      return 'text-base';
    }
    if (type === 'title') {
      if (fontSizeMode === 'normal') return 'text-[10px]';
      if (fontSizeMode === 'large') return 'text-xs';
      return 'text-sm';
    }
    return fontSizeMode === 'normal' ? 'text-[10px]' : fontSizeMode === 'large' ? 'text-xs' : 'text-sm';
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [bubbleText, setBubbleText] = useState<string>(() => {
    let savedName = '';
    try {
      const saved = localStorage.getItem('pet_user_memory');
      if (saved) savedName = JSON.parse(saved).userName;
    } catch(e) {}

    const hour = new Date().getHours();
    let greeting = savedName ? `Merhaba ${savedName}!` : "Merhaba!";
    if (hour >= 5 && hour < 12) greeting = savedName ? `Günaydın ${savedName}! ☀️` : "Günaydın! ☀️ Güne harika bir başlangıç yapmaya ne dersin?";
    else if (hour >= 12 && hour < 18) greeting = savedName ? `Tünaydın ${savedName}! 🌤️` : "Tünaydın! 🌤️ Öğleden sonraki süreçleri tıkır tıkır işletelim mi?";
    else if (hour >= 18 && hour < 22) greeting = savedName ? `İyi akşamlar ${savedName}! 🌙` : "İyi akşamlar! 🌙 Günün yorgunluğunu birlikte atalım.";
    else greeting = savedName ? `İyi geceler ${savedName}! 😴` : "İyi geceler! 😴 Ben biraz uykuluyum ama istersen hala buradayım.";
    
    return `${greeting}\n\nBen senin Kurumsal Süreç Asistanınım. Bugün hangi süreci takip ediyoruz? 🤖\n\n💡 İpucu: Üzerime sağ tıklayarak özel menümü açabilirsin!`;
  });
  const [showBubble, setShowBubble] = useState(true);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet_sound_enabled');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const setSoundEnabled = (val: boolean | ((prev: boolean) => boolean)) => {
    setSoundEnabledState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_sound_enabled', next.toString()); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_sound_enabled', value: next.toString() } }));
      return next;
    });
  };

  const [ttsEnabled, setTtsEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet_tts_enabled');
      return saved === 'true';
    } catch (e) { return false; }
  });

  const setTtsEnabled = (next: boolean) => {
    setTtsEnabledState(next);
    try {
      localStorage.setItem('pet_tts_enabled', next.toString());
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_tts_enabled', value: next.toString() } }));
  };

  const speak = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.1;
    utterance.pitch = 1.2; // Slightly higher pitch for a "robot" feel
    
    window.speechSynthesis.speak(utterance);
  };

  const [tipIndex, setTipIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Pet care system & personalization
  const [costume, setCostumeState] = useState<'classic' | 'expert' | 'stethoscope' | 'glasses'>(() => {
    try {
      const saved = localStorage.getItem('pet_costume');
      if (saved) return saved as any;
    } catch (e) {}
    return 'classic';
  });

  const setCostume = (val: 'classic' | 'expert' | 'stethoscope' | 'glasses' | ((prev: any) => any)) => {
    setCostumeState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_costume', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_costume', value: next } }));
      return next;
    });
  };

  const [energyLevel, setEnergyLevelState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pet_energy');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 75;
  });

  const setEnergyLevel = (val: number | ((prev: number) => number)) => {
    setEnergyLevelState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      const capped = Math.max(0, Math.min(100, next));
      try { localStorage.setItem('pet_energy', capped.toString()); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_energy', value: capped.toString() } }));
      return capped;
    });
  };

  const [fontSizeMode, setFontSizeModeState] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem('pet_font_size');
      if (saved) return saved as any;
    } catch (e) {}
    return 'large';
  });

  const setFontSizeMode = (val: 'normal' | 'large' | 'xlarge' | ((prev: any) => any)) => {
    setFontSizeModeState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_font_size', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_font_size', value: next } }));
      return next;
    });
  };

  const [userMemory, setUserMemoryState] = useState<{ userName: string; favoriteActivities: string; goals: string }>(() => {
    try {
      const saved = localStorage.getItem('pet_user_memory');
      return saved ? JSON.parse(saved) : { userName: '', favoriteActivities: '', goals: '' };
    } catch (e) {
      return { userName: '', favoriteActivities: '', goals: '' };
    }
  });

  const setUserMemory = (val: any) => {
    setUserMemoryState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_user_memory', JSON.stringify(next)); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_user_memory', value: JSON.stringify(next) } }));
      return next;
    });
  };

  const [petName, setPetNameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pet_name');
      if (saved) return saved;
    } catch (e) {}
    return 'Sürecik 🤖';
  });

  const setPetName = (val: string | ((prev: string) => string)) => {
    setPetNameState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_name', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_name', value: next } }));
      return next;
    });
  };

  const handleDropText = (text: string) => {
    setDroppedText(text);
    setShowBubble(true);
    setRobotState('surprised');
    setBubbleText(`Ooo! Yeni bir şey mi yakaladık? 🎣\n"${text.length > 30 ? text.substring(0, 30) + '...' : text}" metniyle ne yapalım?`);
  };

  // --- NEW FEATURES STATES ---
  
  // Weather State
  const [weather, setWeather] = useState<{ temp: number; condition: string; city: string } | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First try to get location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            // Using a free, no-key-required reverse proxy or public API
            // For production apps, usually OpenWeatherMap with an API key is better.
            // Using open-meteo.com which is free and doesn't require a key!
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await res.json();
            
            if (data.current_weather) {
              const code = data.current_weather.weathercode;
              let condition = 'clear';
              if (code >= 1 && code <= 3) condition = 'cloudy';
              else if (code >= 45 && code <= 48) condition = 'foggy';
              else if (code >= 51 && code <= 67) condition = 'rainy';
              else if (code >= 71 && code <= 77) condition = 'snowy';
              else if (code >= 80 && code <= 82) condition = 'showers';
              else if (code >= 95) condition = 'stormy';

              setWeather({
                temp: Math.round(data.current_weather.temperature),
                condition,
                city: 'Bulunduğun Yer'
              });
            }
          }, () => {
            console.log("Location access denied for weather.");
          });
        }
      } catch (e) {
        console.error("Weather fetch failed", e);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // Update every 30 mins
    return () => clearInterval(interval);
  }, []);

  // Statistics State
  const [stats, setStatsState] = useState<{ focusMinutes: number; quizzesSolved: number; interactions: number }>(() => {
    try {
      const saved = localStorage.getItem('pet_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { focusMinutes: 0, quizzesSolved: 0, interactions: 0 };
  });

  const updateStats = (key: keyof typeof stats, amount: number = 1) => {
    setStatsState(prev => {
      const next = { ...prev, [key]: prev[key] + amount };
      try { localStorage.setItem('pet_stats', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  // Time & Mood Sensitivity
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [floatingEffects, setFloatingEffects] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);

  // Weather Reaction Logic
  useEffect(() => {
    if (!weather) return;

    const timer = setTimeout(() => {
      let weatherMsg = "";
      if (weather.condition === 'rainy' || weather.condition === 'showers') {
        weatherMsg = "Dışarıda yağmur yağıyor gibi gözüküyor. ☔ Şemsiyeni yanına almayı unutma!";
      } else if (weather.condition === 'stormy') {
        weatherMsg = "Vay canına, dışarıda fırtına var! ⛈️ Güvende kal ve sıcak bir kahve eşliğinde çalışalım.";
      } else if (weather.temp > 30) {
        weatherMsg = `Hava bugün çok sıcak (${weather.temp}°C)! ☀️ Vantilatörü açıp bol bol su içmeyi unutma.`;
      } else if (weather.temp < 5) {
        weatherMsg = `Dışarısı buz gibi (${weather.temp}°C)! ❄️ Sıkı giyinmeyi ve pencereleri kapatmayı unutma.`;
      } else if (weather.condition === 'clear') {
        weatherMsg = "Hava bugün pırıl pırıl! ✨ Bir ara pencereyi açıp taze havayı içine çekmelisin.";
      }

      if (weatherMsg) {
        handleInteract('happy', weatherMsg);
      }
    }, 5000); // Wait a bit after mount

    return () => clearTimeout(timer);
  }, [weather]);

  const addFloatingEffect = (icon: string) => {
    const id = Date.now() + Math.random();
    setFloatingEffects(prev => [...prev, { id, icon, x: Math.random() * 40 - 20, y: -20 }]);
    setTimeout(() => {
      setFloatingEffects(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  // --- END NEW FEATURES STATES ---

  const [soundTheme, setSoundThemeState] = useState<'retro' | 'modern' | 'futuristic'>(() => {
    try {
      const saved = localStorage.getItem('pet_sound_theme');
      if (saved === 'retro' || saved === 'modern' || saved === 'futuristic') return saved;
    } catch (e) {}
    return 'modern';
  });

  const setSoundTheme = (val: 'retro' | 'modern' | 'futuristic' | ((prev: any) => any)) => {
    setSoundThemeState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_sound_theme', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_sound_theme', value: next } }));
      return next;
    });
  };

  const [isSleeping, setIsSleeping] = useState(false);

  const [petTheme, setPetThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('pet_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark'; // Default to dark theme for standalone, but toggleable
  });

  const setPetTheme = (val: 'light' | 'dark' | ((prev: any) => any)) => {
    setPetThemeState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_theme', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_theme', value: next } }));
      return next;
    });
  };

  const getRobotColors = () => {
    if (isSleeping) return { body: "#f1f5f9", border: "#94a3b8" };
    
    let bodyColor = "#eff6ff";
    let borderColor = "#2563eb";
    
    if (energyLevel < 30) {
      bodyColor = "#f8fafc";
      borderColor = "#cbd5e1";
    } else if (energyLevel > 80 && robotState === 'happy') {
      bodyColor = "#dbeafe";
      borderColor = "#3b82f6";
    }
    
    return { body: bodyColor, border: borderColor };
  };

  const robotColors = getRobotColors();

  // Desktop Pet specific state variables
  const [isRoaming, setIsRoamingState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet_is_roaming');
      return saved === 'true';
    } catch (e) { return false; }
  });

  const setIsRoaming = (next: boolean) => {
    setIsRoamingState(next);
    try {
      localStorage.setItem('pet_is_roaming', next.toString());
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_is_roaming', value: next.toString() } }));
  };

  const [teleportEnabled, setTeleportEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet_teleport_enabled');
      return saved !== 'false';
    } catch (e) { return true; }
  });

  const setTeleportEnabled = (next: boolean) => {
    setTeleportEnabledState(next);
    try {
      localStorage.setItem('pet_teleport_enabled', next.toString());
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_teleport_enabled', value: next.toString() } }));
  };

  const [walkDirection, setWalkDirection] = useState<'left' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isMovedRef = useRef(false);

  // Screen Edge Interactions Effect
  useEffect(() => {
    if (isDragging || isRoaming || isMinimized) {
      setEdgeInteraction('none');
      return;
    }

    const checkEdges = () => {
      const robotWidth = 70;
      const robotHeight = 70;
      
      // Calculate current coordinates relative to screen
      // Robot is anchored at bottom-6 (24px) and left-6 (24px)
      const currentX = 24 + position.x;
      const currentY = window.innerHeight - 24 - robotHeight - position.y;

      const threshold = 10;
      const cornerThreshold = 40;

      // Reset sleeping if we moved away from corners
      const isInCorner = (
        (currentX < cornerThreshold && currentY < cornerThreshold) || // Top-left
        (currentX > window.innerWidth - robotWidth - cornerThreshold && currentY < cornerThreshold) || // Top-right
        (currentX < cornerThreshold && currentY > window.innerHeight - robotHeight - cornerThreshold) || // Bottom-left
        (currentX > window.innerWidth - robotWidth - cornerThreshold && currentY > window.innerHeight - robotHeight - cornerThreshold) // Bottom-right
      );

      if (!isInCorner && isSleeping) {
        setIsSleeping(false);
      }

      // Priority 1: Corners for sleeping
      if (isInCorner) {
        if (!isSleeping && !isDragging) {
          setIsSleeping(true);
          handleInteract('idle', "Ah, bu köşe çok rahatmış... Biraz kestireyim. 💤💤");
        }
        setEdgeInteraction('sleeping_corner');
      }
      // Priority 2: Edges
      else if (currentY > window.innerHeight - robotHeight - threshold) {
        setEdgeInteraction('peeking_bottom');
      } 
      else if (currentY < threshold) {
        setEdgeInteraction('peeking_top');
      }
      else if (currentX < threshold) {
        setEdgeInteraction('clinging_left');
      }
      else if (currentX > window.innerWidth - robotWidth - threshold) {
        setEdgeInteraction('clinging_right');
      }
      else {
        setEdgeInteraction('none');
      }
    };

    checkEdges();
    const handleResize = () => checkEdges();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, isDragging, isRoaming, isMinimized, isSleeping]);

  // Focus Timer & Reminders State
  const [focusTimeLeft, setFocusTimeLeft] = useState<number>(0); // in seconds
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [breakRemindersEnabled, setBreakRemindersEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pet_break_reminders') !== 'false';
    } catch (e) { return true; }
  });

  const [minimizeOnClose, setMinimizeOnCloseState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet_minimize_on_close');
      return saved !== 'false';
    } catch (e) { return true; }
  });

  const setMinimizeOnClose = (next: boolean) => {
    setMinimizeOnCloseState(next);
    try {
      localStorage.setItem('pet_minimize_on_close', next.toString());
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_minimize_on_close', value: next.toString() } }));
  };
  const lastInteractionRef = useRef<number>(Date.now());
  const cumulativeWorkTimeRef = useRef<number>(0);

  // Quiz game state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const [quizScore, setQuizScoreState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pet_quiz_score');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 0;
  });

  // Quick Search, Step Analysis and Quiz Category states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchView, setIsSearchView] = useState(false);
  const [showStepAnalysis, setShowStepAnalysis] = useState(false);
  const [quizCategory, setQuizCategory] = useState<'Tümü' | 'Genel Mevzuat' | 'İzin Hakları' | 'Sözleşmeli Personel' | 'Sağlık Mevzuatı' | 'Disiplin Mevzuatı' | 'Mali Haklar' | 'Emeklilik İşlemleri'>('Tümü');
  const [isLibraryView, setIsLibraryView] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<LegislationTopic | null>(null);

  // Smart Regulatory Feed and Well-being states
  const [showRegulatoryFeed, setShowRegulatoryFeed] = useState(false);
  const [showWellbeing, setShowWellbeing] = useState(false);
  const [wellbeingStage, setWellbeingStage] = useState<'menu' | 'eye' | 'stretch' | 'posture'>('menu');
  const [wellbeingStep, setWellbeingStep] = useState(0);
  const [wellbeingTimer, setWellbeingTimer] = useState(5);
  const [wellbeingActive, setWellbeingActive] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Nudge State for proactive behaviors
  const [nudgeState, setNudgeState] = useState<'none' | 'jumping' | 'shaking' | 'stretching'>('none');

  // Advanced Interaction States
  const [isNearDrop, setIsNearDrop] = useState(false);
  const [droppedText, setDroppedText] = useState<string | null>(null);
  const [isDraftingView, setIsDraftingView] = useState(false);
  const [draftType, setDraftType] = useState<'petition' | 'official_letter' | 'notification'>('petition');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [edgeInteraction, setEdgeInteraction] = useState<'none' | 'clinging_left' | 'clinging_right' | 'peeking_bottom' | 'peeking_top' | 'sleeping_corner'>('none');

  // Sticky Notes & Delivery States
  const [stickyTasks, setStickyTasks] = useState<StickyTask[]>(() => {
    try {
      const saved = localStorage.getItem('pet_sticky_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showStickyForm, setShowStickyForm] = useState(false);
  const [stickyFormText, setStickyFormText] = useState('');
  const [stickyFormCarryType, setStickyFormCarryType] = useState<'mouth_envelope' | 'head_postit'>('mouth_envelope');
  const [stickyFormTime, setStickyFormTime] = useState<number>(0);
  const [activeNotificationTask, setActiveNotificationTask] = useState<StickyTask | null>(null);

  const saveStickyTasks = (tasks: StickyTask[]) => {
    setStickyTasks(tasks);
    try {
      localStorage.setItem('pet_sticky_tasks', JSON.stringify(tasks));
    } catch (e) {}
  };

  // --- START OFFLINE PERSISTENCE LOGIC ---
  
  // Load data from disk on mount
  useEffect(() => {
    const loadFromDisk = async () => {
      try {
        const response = await fetch('/api/storage/load');
        if (response.ok) {
          const { data } = await response.json();
          if (data) {
            // Update all local states and localStorage from disk data
            Object.entries(data).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                
                // Dispatch events to update state variables that use localStorage initializers
                if (key === 'pet_quiz_score') setQuizScoreState(Number(value));
                if (key === 'pet_sticky_tasks') setStickyTasks(value as StickyTask[]);
                if (key === 'pet_sound_theme') setSoundThemeState(value as any);
                if (key === 'pet_theme') setPetThemeState(value as any);
                if (key === 'pet_is_roaming') setIsRoamingState(value === 'true' || value === true);
                if (key === 'pet_teleport_enabled') setTeleportEnabledState(value !== 'false' && value !== false);
                if (key === 'pet_minimize_on_close') setMinimizeOnCloseState(value !== 'false' && value !== false);
                if (key === 'pet_break_reminders') setBreakRemindersEnabled(value !== 'false' && value !== false);
                if (key === 'pet_name') setPetNameState(value as string);
                if (key === 'pet_costume') setCostumeState(value as any);
                if (key === 'pet_energy') setEnergyLevelState(Number(value));
                if (key === 'pet_stats') setStatsState(value as any);
                if (key === 'pet_sound_enabled') setSoundEnabledState(value === 'true' || value === true);
                if (key === 'pet_tts_enabled') setTtsEnabledState(value === 'true' || value === true);
                if (key === 'pet_font_size') setFontSizeModeState(value as any);
                if (key === 'pet_user_memory' && typeof value === 'string') setUserMemoryState(JSON.parse(value));
              }
            });
          }
        }
      } catch (e) {
        console.error("Offline data load failed:", e);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadFromDisk();
  }, []);

  // Save to disk whenever relevant states change
  useEffect(() => {
    if (!isDataLoaded) return;

    const syncToDisk = async () => {
      try {
        const dataToSave: Record<string, any> = {
          pet_quiz_score: quizScore,
          pet_sticky_tasks: stickyTasks,
          pet_sound_theme: soundTheme,
          pet_theme: petTheme,
          pet_is_roaming: isRoaming,
          pet_teleport_enabled: teleportEnabled,
          pet_minimize_on_close: minimizeOnClose,
          pet_break_reminders: breakRemindersEnabled,
          pet_name: petName,
          pet_costume: costume,
          pet_energy: energyLevel,
          pet_stats: stats,
          pet_sound_enabled: soundEnabled,
          pet_tts_enabled: ttsEnabled,
          pet_font_size: fontSizeMode
        };

        await fetch('/api/storage/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataToSave })
        });
      } catch (e) {
        console.error("Offline data save failed:", e);
      }
    };

    const timeout = setTimeout(syncToDisk, 2000); // Debounce save
    return () => clearTimeout(timeout);
  }, [
    isDataLoaded,
    quizScore,
    stickyTasks,
    soundTheme,
    petTheme,
    isRoaming,
    teleportEnabled,
    minimizeOnClose,
    breakRemindersEnabled,
    petName,
    costume,
    energyLevel,
    stats,
    soundEnabled,
    ttsEnabled,
    userMemory,
    fontSizeMode
  ]);

  // --- END OFFLINE PERSISTENCE LOGIC ---

  const handleGenerateDraft = async (customSubject?: string) => {
    const subject = customSubject || draftSubject;
    if (!subject.trim()) {
      handleInteract('surprised', "Lütfen ne hakkında bir yazı hazırlamamı istediğinizi belirtin! ✍️");
      return;
    }

    setIsGeneratingDraft(true);
    setRobotState('thinking');
    setBubbleText("Taslağınız üzerinde çalışıyorum... Lütfen bekleyin. ✍️✨");

    const typeLabels = {
      petition: 'Dilekçe',
      official_letter: 'Resmi Yazı',
      notification: 'Tebligat Yazısı'
    };

    const prompt = `Lütfen aşağıdaki konu hakkında kurallara uygun, profesyonel bir ${typeLabels[draftType]} taslağı hazırla. 
Konu: ${subject}
Lütfen sadece taslak metnini ver, başında veya sonunda ekstra açıklama yapma.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, context: 'Yazım Asistanı Modu' }),
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      
      setDraftResult(data.reply);
      setRobotState('happy');
      setBubbleText("İşte hazırladığım taslak! Beğendiniz mi? 📑✨");
    } catch (error) {
      console.error(error);
      handleInteract('surprised', "Taslak hazırlarken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const renderDraftingView = () => (
    <div className="flex flex-col gap-3 animate-in fade-in zoom-in duration-300">
      <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
        petTheme === 'light' ? 'text-indigo-600 border-slate-100' : 'text-indigo-400 border-slate-800'
      }`}>
        <PenTool size={13} className="shrink-0" />
        <span className="text-[11px]">Resmi Yazı & Dilekçe Asistanı</span>
        <button 
          onClick={() => { setIsDraftingView(false); setDraftResult(''); setDraftSubject(''); }}
          className="ml-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
        >
          <ArrowLeft size={11} /> Geri
        </button>
      </div>

      {!draftResult ? (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Yazı Türü</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'petition', label: 'Dilekçe', icon: <FileText size={12} /> },
                { id: 'official_letter', label: 'Resmi Yazı', icon: <Pencil size={12} /> },
                { id: 'notification', label: 'Tebligat', icon: <Mail size={12} /> }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setDraftType(type.id as any)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-[10px] font-bold transition-all ${
                    draftType === type.id 
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-200/40' 
                      : petTheme === 'light' ? 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Konu / İçerik</label>
            <textarea
              placeholder="Yazının ne hakkında olacağını kısaca belirtin..."
              value={draftSubject}
              onChange={(e) => setDraftSubject(e.target.value)}
              className={`w-full text-[11px] px-3 py-2 rounded-xl border outline-none font-medium h-20 resize-none ${
                petTheme === 'light' 
                  ? 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500' 
                  : 'bg-slate-900 text-white border-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>

          <button
            disabled={isGeneratingDraft || !draftSubject.trim()}
            onClick={() => handleGenerateDraft()}
            className={`w-full py-2.5 rounded-xl text-white text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
              isGeneratingDraft || !draftSubject.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-indigo-100/50'
            }`}
          >
            {isGeneratingDraft ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Hazırlanıyor...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Taslak Oluştur
              </>
            )}
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <div className={`p-4 rounded-2xl border max-h-[220px] overflow-y-auto custom-scrollbar whitespace-pre-wrap text-[11px] leading-relaxed relative group ${
            petTheme === 'light' ? 'bg-indigo-50/30 border-indigo-100 text-slate-700' : 'bg-indigo-900/10 border-indigo-900/30 text-indigo-100'
          }`}>
            {draftResult}
            <button
              onClick={() => {
                navigator.clipboard.writeText(draftResult);
                handleInteract('happy', "Taslak başarıyla kopyalandı! 📋✨");
              }}
              className="absolute top-2 right-2 p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Kopyala"
            >
              <Copy size={12} className="text-indigo-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDraftResult('')}
              className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${
                petTheme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Yeniden Düzenle
            </button>
            <button
              onClick={() => { setIsDraftingView(false); setDraftResult(''); setDraftSubject(''); }}
              className="py-2 text-[10px] font-bold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-sm"
            >
              Bitti
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const addStickyTaskDirectly = (text: string, carryType: 'mouth_envelope' | 'head_postit' = 'head_postit', timeMins: number = 0) => {
    const activeTasks = stickyTasks.filter(t => !t.completed);
    const currentOfSameType = activeTasks.filter(t => t.carryType === carryType);
    
    if (currentOfSameType.length >= 1) {
      handleInteract('happy', carryType === 'mouth_envelope' 
        ? "Ağzımda zaten bir mektup taşıyorum! ✉️ Lütfen önce onu tamamlayın." 
        : "Başımda zaten bir yapışkan not taşıyorum! 📌 Lütfen önce onu tamamlayın."
      );
      return false;
    }

    const now = Date.now();
    const remindAt = timeMins > 0 ? now + (timeMins * 60 * 1000) : null;
    
    const newTask: StickyTask = {
      id: Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      carryType,
      durationMins: timeMins,
      createdAt: now,
      remindAt,
      notified: false,
      completed: false
    };
    
    const nextTasks = [...stickyTasks, newTask];
    saveStickyTasks(nextTasks);
    
    setRobotState('happy');
    setNudgeState('jumping');
    
    setTimeout(() => setNudgeState('none'), 1200);
    return true;
  };

  const setQuizScore = (val: number | ((prev: number) => number)) => {
    setQuizScoreState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('pet_quiz_score', next.toString()); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pet_sync_event', { detail: { key: 'pet_quiz_score', value: next.toString() } }));
      return next;
    });
  };

  // Sync state between parent window and standalone window in real time via storage / custom event listener
  useEffect(() => {
    const handleSync = (key: string, newValue: string | null) => {
      if (!newValue) return;
      try {
        if (key === 'pet_costume') {
          setCostumeState(newValue as any);
        }
        if (key === 'pet_name') {
          setPetNameState(newValue);
        }
        if (key === 'pet_energy') {
          setEnergyLevelState(parseInt(newValue, 10));
        }
        if (key === 'pet_font_size') {
          setFontSizeModeState(newValue as any);
        }
        if (key === 'pet_quiz_score') {
          setQuizScoreState(parseInt(newValue, 10));
        }
        if (key === 'pet_sound_enabled') {
          setSoundEnabledState(newValue === 'true');
        }
        if (key === 'pet_sound_theme') {
          setSoundThemeState(newValue as any);
        }
        if (key === 'pet_minimize_on_close') {
          setMinimizeOnCloseState(newValue === 'true');
        }
        if (key === 'pet_is_roaming') {
          setIsRoamingState(newValue === 'true');
        }
        if (key === 'pet_teleport_enabled') {
          setTeleportEnabledState(newValue === 'true');
        }
        if (key === 'pet_theme') {
          setPetThemeState(newValue as any);
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      handleSync(e.key || '', e.newValue);
    };

    const handleCustomChange = (e: Event) => {
      const customEv = e as CustomEvent<{ key: string; value: string }>;
      if (customEv.detail) {
        handleSync(customEv.detail.key, customEv.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('pet_sync_event', handleCustomChange);
    
    // Track interactions for break reminders and sleep
    const trackInteraction = () => { 
      lastInteractionRef.current = Date.now(); 
      if (isSleeping) {
        setIsSleeping(false);
        handleInteract('happy', "Geri geldin! Ben de biraz kestiriyordum. Hadi işimize dönelim! ✨");
      }
    };
    window.addEventListener('mousedown', trackInteraction);
    window.addEventListener('keydown', trackInteraction);

    // Idle Sleep & Random Jump Logic
    const behaviorInterval = setInterval(() => {
      const idleTime = Date.now() - lastInteractionRef.current;
      
      // Sleep after 2 minutes of inactivity (if not focusing)
      if (idleTime > 120000 && !isFocusing && !isSleeping) {
        setIsSleeping(true);
        setRobotState('idle');
      }

      // Random Jump (10% chance every 30 seconds if enabled and not focusing/sleeping/dragging)
      if (teleportEnabled && Math.random() < 0.1 && !isFocusing && !isSleeping && !isDragging) {
        const isElectron = typeof window !== 'undefined' && (
          navigator.userAgent.toLowerCase().includes('electron') ||
          !!(window as any).ipcRenderer ||
          typeof (window as any).require === 'function'
        );

        if (isStandalone && isElectron) {
          try {
            const { ipcRenderer } = (window as any).require('electron');
            ipcRenderer.send('teleport-mascot-window');
            handleInteract('happy', "Hop! Masaüstünün başka bir köşesine ışınlandım! 🚀✨");
            playBeep(660, 150);
            setTimeout(() => playBeep(880, 150), 150);
          } catch (err) {
            console.error('Failed to teleport window via IPC:', err);
          }
        } else if (!isRoaming) {
          // Calculate bounds relative to bottom-6 left-6
          const maxX = window.innerWidth - 150;
          const maxY = window.innerHeight - 150;
          
          const randomX = Math.random() * maxX;
          const randomY = Math.random() * -maxY; // Negative because it's absolute bottom
          
          setPosition({ x: randomX, y: randomY });
          handleInteract('happy', "Hop! Bir köşeden diğerine ışınlandım! 🚀✨");
          playBeep(660, 150);
          setTimeout(() => playBeep(880, 150), 150);
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('pet_sync_event', handleCustomChange);
      window.removeEventListener('mousedown', trackInteraction);
      window.removeEventListener('keydown', trackInteraction);
      clearInterval(behaviorInterval);
    };
  }, [isFocusing, isSleeping, isDragging, isRoaming, teleportEnabled, isStandalone]);

  // Sync minimizeOnClose option to Electron via IPC
  useEffect(() => {
    const isElectron = typeof window !== 'undefined' && (
      navigator.userAgent.toLowerCase().includes('electron') ||
      !!(window as any).ipcRenderer ||
      typeof (window as any).require === 'function'
    );

    if (isElectron) {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('set-minimize-on-close', minimizeOnClose);
      } catch (err) {
        console.error('Failed to send minimize-on-close to Electron:', err);
      }
    }
  }, [minimizeOnClose]);

  // Helper for opening external links (supports system browser in Electron)
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (isStandalone && (window as any).ipcRenderer) {
      e.preventDefault();
      (window as any).ipcRenderer.send('open-external-link', url);
    }
  };

  // Standalone window dragging mechanism using client-side delta coordinates (avoids WebkitAppRegion click-intercept bugs)
  useEffect(() => {
    if (!isDragging || !isStandalone) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.screenX - dragStartRef.current.x;
      const dy = e.screenY - dragStartRef.current.y;
      
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        isMovedRef.current = true;
      }
      
      if (dx !== 0 || dy !== 0) {
        dragStartRef.current = { x: e.screenX, y: e.screenY };
        const isElectron = typeof window !== 'undefined' && (
          navigator.userAgent.toLowerCase().includes('electron') ||
          !!(window as any).ipcRenderer ||
          typeof (window as any).require === 'function'
        );
        if (isElectron) {
          try {
            const { ipcRenderer } = (window as any).require('electron');
            ipcRenderer.send('drag-mascot-window', { dx, dy });
          } catch (err) {
            console.error('Failed to drag window:', err);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isStandalone]);

  // Focus Timer Logic
  useEffect(() => {
    if (!isFocusing || focusTimeLeft <= 0) {
      if (isFocusing && focusTimeLeft <= 0) {
        setIsFocusing(false);
        const nextMode = focusMode === 'work' ? 'shortBreak' : 'work';
        setFocusMode(nextMode);
        
        if (focusMode === 'work') {
          handleInteract('happy', "Harika iş çıkardın! Odaklanma seansı bitti. Şimdi kısa bir mola verme zamanı! ☕✨");
          playBeep(880, 200);
          setTimeout(() => playBeep(1100, 300), 250);
        } else {
          handleInteract('happy', "Mola bitti! Kendini tazeledin mi? Şimdi tekrar işe odaklanma vakti! 🚀📝");
          playBeep(440, 200);
          setTimeout(() => playBeep(660, 300), 250);
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setFocusTimeLeft(prev => {
        if (prev <= 1) {
          if (focusMode === 'work') updateStats('focusMinutes', 1); // Add last minute
          return 0;
        }
        // Every 60 seconds, update cumulative focus stats
        if (prev % 60 === 0 && focusMode === 'work') {
          updateStats('focusMinutes', 1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFocusing, focusTimeLeft, focusMode]);

  // Break Reminders Logic (Every 45 mins of activity)
  useEffect(() => {
    if (!breakRemindersEnabled) return;

    const checkInterval = setInterval(() => {
      const idleTime = Date.now() - lastInteractionRef.current;
      
      // If user is active (not idle for more than 5 mins)
      if (idleTime < 300000) {
        cumulativeWorkTimeRef.current += 60000; // Add 1 minute
      }

      // If worked for 45 mins cumulatively
      if (cumulativeWorkTimeRef.current >= 2700000 && !isFocusing) {
        cumulativeWorkTimeRef.current = 0; // Reset
        triggerProactiveNudge();
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [breakRemindersEnabled, isFocusing]);

  // Sticky Notes Reminder checking timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      let hasUpdated = false;
      const nextTasks = stickyTasks.map(task => {
        if (!task.completed && task.remindAt && now >= task.remindAt && !task.notified) {
          hasUpdated = true;
          triggerStickyNotification(task);
          return { ...task, notified: true };
        }
        return task;
      });
      if (hasUpdated) {
        saveStickyTasks(nextTasks);
      }
    }, 4000); // Check every 4 seconds

    return () => clearInterval(timer);
  }, [stickyTasks]);

  // Well-being Routine Timer Logic
  useEffect(() => {
    if (!wellbeingActive) return;

    const steps = wellbeingStage === 'eye' 
      ? eyeExerciseSteps 
      : wellbeingStage === 'stretch' 
        ? stretchExerciseSteps 
        : wellbeingStage === 'posture' 
          ? postureExerciseSteps 
          : [];

    if (steps.length === 0) return;

    const interval = setInterval(() => {
      setWellbeingTimer(prev => {
        if (prev <= 1) {
          // Move to next step
          const nextStep = wellbeingStep + 1;
          if (nextStep >= steps.length) {
            // Completed!
            setWellbeingActive(false);
            setWellbeingStep(0);
            setWellbeingTimer(0);
            playBeep(880, 250);
            // Boost energy and stats
            setEnergyLevel(prevEnergy => Math.min(100, prevEnergy + 15));
            updateStats('interactions', 1);
            setRobotState('happy');
            setBubbleText("Tebrikler! Sağlık rutinini tamamladın. Kendini daha zinde ve enerjik hissediyor musun? 🌟💪");
          } else {
            setWellbeingStep(nextStep);
            const duration = steps[nextStep].duration;
            playBeep(660, 120);
            return duration;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [wellbeingActive, wellbeingStep, wellbeingStage]);

  const startFocusSession = (minutes: number) => {
    setFocusTimeLeft(minutes * 60);
    setIsFocusing(true);
    setFocusMode('work');
    handleInteract('thinking', `Tamamdır! ${minutes} dakika boyunca odaklanıyoruz. Ben buradayım, seni kimsenin rahatsız etmesine izin vermeyeceğim! 🤫🛡️`);
    setContextMenu(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Daily resetting ISm Status
  const [ismStatus, setIsmStatus] = useState<'pending' | 'sent'>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('ism_daily_date');
      const savedStatus = localStorage.getItem('ism_daily_status');
      if (savedDate === today && savedStatus) {
        return savedStatus as 'pending' | 'sent';
      }
    } catch (e) {
      console.error(e);
    }
    return 'pending';
  });

  const tips = [
    "Uzman Hekim göreve başlamalarında yeni EKİP (Entegre Kurumsal İşlem Platformu) kaydı düştükten sonra 15 gün içinde tebligat yapılmalıdır.",
    "4/B Sözleşmeli personelin işe başlama evraklarında Güvenlik Soruşturması ve Arşiv Araştırması belgesi kritik önem taşır (7315 Sayılı Güvenlik Soruşturması Kanunu).",
    "Sürekli işçi girişlerinde SGK işe giriş bildirgesinin en geç işe başlamadan 1 gün önce yapılması yasal zorunluluktur (5510 Sayılı Kanun Md. 8).",
    "KVKK uyarınca, personelin sağlık raporu ve sabıka kaydı gibi hassas kişisel verileri kilitli dolaplarda saklanmalı ve yetkisiz erişim engellenmelidir.",
    "Süreç adımlarını eksiksiz tamamlamak için sağ taraftaki yapay zekâ asistanına her zaman danışabilirsin!",
    "Kurumunuza özel yeni bir süreç tasarlamak için sol alt kısımdaki 'Yeni Şablon Tasarla' seçeneğini kullanabilirsiniz.",
    "Yıllık izin taleplerinde, memurun çalışılan yıla ait hak ettiği izin süresi ile bir önceki yıldan devreden izni birleştirilebilir, ancak daha önceki yılların izni yanar (657 DMK Md. 102).",
    "Kadın memura, doğum sonrası analık izni süresinin bitiminden itibaren ilk altı ayda günde 3 saat, ikinci altı ayda günde 1,5 saat süt izni verilir. İznin kullanılacağı saatleri kadın memur kendisi tercih eder (657 DMK Md. 104/D).",
    "Doğum sonrası analık izni bitiminden itibaren kadın memur (veya 3 yaşını doldurmamış çocuğu evlat edinen memur) birinci doğumda 2 ay, ikinci doğumda 4 ay, sonraki doğumlarda ise 6 ay süreyle yarım zamanlı (günlük çalışma süresinin yarısı kadar) çalışabilir (657 DMK Md. 104/F).",
    "Refakat izni; memurun bakmakla yükümlü olduğu veya refakat etmediği takdirde hayatı tehlikeye girecek ana, baba, eş ve çocukları ile kardeşlerinin ağır kaza geçirmesi veya tedavisi uzun süren bir hastalığının bulunması hâllerinde sağlık kurulu raporuyla belgelendirilmesi şartıyla 3 aya kadar verilir ve en fazla bir katına kadar (toplam 6 aya kadar) uzatılır (657 DMK Md. 105).",
    "Memura; kendisinin veya çocuğunun evlenmesi ya da eşinin, çocuğunun, kendisinin veya eşinin ana, baba ve kardeşinin ölümü hâllerinde isteği üzerine 7 gün mazeret izni verilir (657 DMK Md. 104/B).",
    "Müstafi sayılma: İzinsiz veya özürsüz olarak kesintisiz 10 gün görevini terk eden memur, yazılı müracaat şartı aranmaksızın görevden çekilmiş (müstafi) sayılır (657 DMK Md. 94).",
    "Aday memurluk süresi asgari 1 yıl, azami 2 yıldır. Bu süre içinde olumsuz değerlendirilen veya disiplin cezası alan aday memurların görevine son verilir (657 DMK Md. 54-57).",
    "Devlet hizmeti yükümlülüğü (DHY) kapsamındaki tabipler, atanma kararlarının ilanından itibaren yol süresi hariç 15 gün içinde görevlerine başlamalıdır (657 DMK Md. 62).",
    "Tabipler ve diş tabiplerinin nöbet ücretleri, diğer sağlık personeline oranla Bakanlıkça belirlenen özel katsayılar üzerinden artırımlı ödenir (657 DMK Ek Madde 33).",
    "4/B sözleşmeli personelin yıllık izin hakları bir sonraki yıla devredilemez, ilgili takvim yılı içinde kullanılmayan izinler yanar (Sözleşmeli Personel Çalıştırılmasına İlişkin Esaslar).",
    "Becayiş (Karşılıklı yer değiştirme), aynı unvan ve branştaki personellerin karşılıklı anlaşarak yer değiştirmesidir ve İl Sağlık Müdürlüğü onayıyla gerçekleştirilir (657 DMK Md. 73).",
    "Geçici görevlendirme süresi, bir takvim yılı içinde her ne suretle olursa olsun toplamda 6 ayı geçemez (Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği).",
    "Personelin ad soyad değişikliği, evlilik veya boşanma durumlarında nüfus kayıt örneği ve dilekçesi alınarak EKİP (eski ÇKYS) üzerinde güncellenmelidir.",
    "Sendika üyelik formu veya çekilme formu alındığında, maaş mutemetliğine 3 iş günü içinde bildirilerek kesinti durumu güncellenmelidir (4688 Sayılı Kanun).",
    "Mal bildirimi beyannamesi, sonu (0) ve (5) ile biten yıllarda en geç Şubat ayı sonuna kadar tüm devlet memurları tarafından yenilenmelidir (3628 Sayılı Kanun Md. 6).",
    "Her gün mesai bitiminden önce Günlük Personel Hareket Listesi mutlaka İl Sağlık Müdürlüğü (İSM) İnsan Kaynakları Şubesi'ne gönderilmelidir.",
    "Disiplin amiri, disiplin suçu teşkil eden eylemi öğrendiği tarihten itibaren en geç 1 ay içinde soruşturma başlatmak zorundadır, aksi takdirde soruşturma açma yetkisi zamanaşımına uğrar (657 DMK Md. 127).",
    "Eşinin doğum yapması halinde memura isteği üzerine 10 gün mazeret (babalık) izni verilir (657 DMK Md. 104/B).",
    "Memura tek hekim raporu ile bir defada en çok 10 gün rapor verilebilir. Raporda kontrol süresi belirtilmişse tek hekim bunu en çok 10 gün daha uzatabilir. Bir takvim yılında tek hekim raporları toplamı 40 günü geçemez (Hastalık Raporları Yönetmeliği Md. 6).",
    "En az %70 oranında engelli veya süreğen hastalığı olan çocuğu hastalanan memura, bir yıl içinde toptan veya bölümler hâlinde 10 güne kadar mazeret izni verilir (657 DMK Md. 104/E).",
    "Radyonüklit ve iyonizan radyasyonla çalışan personele, her yıl yıllık izinlerine ilaveten 30 gün ücretli sağlık izni (şua izni) verilmesi zorunludur.",
    "Memuriyetten usulüne uygun istifa edenler 6 ay geçmeden tekrar memurluğa atanamazlar. Usulüne uymadan görevden ayrılanlar ise 1 yıl devlet memurluğuna geri dönemezler (657 DMK Md. 97).",
    "Sendikadan çekilmek (istifa) isteyen memur, 3 nüsha çekilme formunu doldurup kuruma teslim eder. Çekilme, bildirim tarihinden itibaren 30 gün sonra geçerlilik kazanır (4688 Sayılı Kanun Md. 16).",
    "Personelin aldığı istirahat raporunu, en geç raporun alındığı günü takip eden iş gününün mesai bitimine kadar kurumuna (evrak kayıt birimine) ulaştırması zorunludur.",
    "Aylıktan kesme cezası kapsamında, memurun brüt aylığının 1/30 ile 1/8 arasında kesinti yapılır. Tebliğ tarihinden itibaren 15 gün içinde itiraz edilmezse ceza kesinleşir (657 DMK Md. 125/C).",
    "Hizmet süresi 1 yıldan 10 yıla kadar olan sağlık personeli ve memurların yıllık izin süresi 20 gün, 10 yıldan fazla olanların ise 30 gündür (657 DMK Md. 102)."
  ];

  const getProactiveMevzuatTip = (step: ActiveStep) => {
    const title = step.title.toLowerCase();
    
    if (title.includes('evrak') || title.includes('belge') || title.includes('diploma') || title.includes('adli sicil')) {
      return `📌 GÖREVE BAŞLAMA EVRAKLARI (Mevzuat Hatırlatması):\n\n657 DMK Madde 48 uyarınca memuriyete girişte diploma aslı veya onaylı sureti, adli sicil kaydı ve sağlık kurulu raporu şarttır. Evrak fotokopilerinin üzerine 'Aslı Görülmüştür' kaşesi vurulmalı ve paraf atılmalıdır.`;
    }
    if (title.includes('sözleşme') || title.includes('hizmet sözleşmesi')) {
      return `✍️ HİZMET SÖZLEŞMESİ (Mevzuat Hatırlatması):\n\nSözleşmeli Personel Esasları Madde 5 gereğince, sözleşmeler her mali yıl için ayrı düzenlenir. Sözleşmenin tüm sayfaları hem personel hem de müdürlük yetkilisi tarafından imzalanmalı ve birer nüsha taraflarda kalmalıdır.`;
    }
    if (title.includes('sgk') || title.includes('sigorta') || title.includes('işe giriş')) {
      return `🚨 SGK İŞE GİRİŞ BİLDİRGESİ (Yasal Zorunluluk):\n\n5510 Sayılı Kanun Madde 8 gereği, 4/B sözleşmeli personelin işe giriş bildirgesi en geç göreve başlamasından bir gün önce SGK sistemine girilmelidir. Geç bildirim durumunda asgari ücret tutarında idari para cezası uygulanır!`;
    }
    if (title.includes('banka') || title.includes('iban') || title.includes('maaş') || title.includes('hesap')) {
      return `💳 MAAŞ VE BANKA İŞLEMLERİ (Mevzuat Hatırlatması):\n\n657 DMK Madde 164 uyarınca devlet memurlarına maaşlar her ayın 15'inde peşin ödenir. Personelin göreve başlama tarihi ay ortasındaysa, takip eden ayın 15'inde geriye dönük kıst maaş (günlük) hesabı yapılarak ödeme listesine eklenmelidir.`;
    }
    if (title.includes('sistem') || title.includes('ekip') || title.includes('çkys') || title.includes('ortak') || title.includes('kayıt')) {
      return `💻 EKİP SİSTEMİ VERİ GİRİŞİ (Sistem Bildirimi):\n\nSağlık Bakanlığı personellerinin atama ve işe başlama onayları artık yeni EKİP (Entegre Kurumsal İşlem Platformu - eski ÇKYS) üzerinden yapılmaktadır. EKİP sistemi başlama tarihi girilmeden personelin aktiflik durumu tetiklenmez ve maaş işlemleri başlatılamaz.`;
    }
    if (title.includes('dys') || title.includes('üst yazı') || title.includes('yazışma') || title.includes('resmi yazı')) {
      return `✉️ DYS ÜST YAZI HAZIRLAMA (Resmî Yazışma Kuralları):\n\nResmî Yazışma Kuralları Yönetmeliği uyarınca, göreve başlama üst yazıları DYS (Doküman Yönetim Sistemi) üzerinden elektronik imzalı olarak İl Sağlık Müdürlüğü'ne iletilir. Sayı numarası ve tarih otomatik üretilir.`;
    }
    if (title.includes('etik') || title.includes('taahhütname') || title.includes('etik sözleşmesi')) {
      return `⚖️ ETİK SÖZLEŞMESİ & TAAHHÜT (Mevzuat Hatırlatması):\n\nKamu Görevlileri Etik Davranış İlkeleri Yönetmeliği gereği, göreve başlayan her personelden ilk hafta içerisinde 'Kamu Görevlileri Etik Sözleşmesi' belgesi imzalı olarak alınmalı ve şahsi özlük dosyasına konulmalıdır.`;
    }
    if (title.includes('oryantasyon') || title.includes('eğitim') || title.includes('uyum')) {
      return `🎯 ADAYLIK VE ORYANTASYON SÜRECİ (DMK Madde 54):\n\nAday memurluk süresi 1 yıldan az 2 yıldan çok olamaz. Bu süreçte adayın temel eğitim, hazırlayıcı eğitim ve staj eğitimlerini başarıyla tamamlaması şarttır. Oryantasyon programı süreci kolaylaştırır.`;
    }
    
    if (title.includes('emekli') || title.includes('emeklilik') || title.includes('yaş haddi')) {
      return `👴 EMEKLİLİK İŞLEMLERİ (Mevzuat Hatırlatması):\n\n5510 Sayılı Kanun gereği, emeklilik talebinde bulunan personelin hizmet birleştirmeleri ve askerlik borçlanmaları önceden kontrol edilmelidir. Emeklilik onayı gelmeden personelin ilişiği kesilmemeli ve SGK çıkışı yapılmamalıdır.`;
    }
    if (title.includes('disiplin') || title.includes('soruşturma') || title.includes('savunma')) {
      return `⚖️ DİSİPLİN SORUŞTURMASI (657 DMK Md. 130):\n\nDevlet memuru hakkında savunması alınmadan disiplin cezası verilemez. Savunma için en az 7 gün süre verilmesi şarttır. Bu süreye uyulmaması, işlemin usulden iptal edilmesine neden olur!`;
    }
    if (title.includes('istifa') || title.includes('ayrılış') || title.includes('çekilme')) {
      return `👋 GÖREVDEN AYRILMA (Mevzuat Hatırlatması):\n\n657 DMK Md. 94 uyarınca devlet memuru bağlı olduğu kuruma yazılı olarak müracaat etmek suretiyle memurluktan çekilme isteğinde bulunabilir. Yerine atanan kimsenin gelmesine kadar görevine devam etmesi esastır.`;
    }
    
    return `💡 ADIM İPUCU [${step.title}]:\n\n${step.description}\n\nYasal Mevzuat: ${step.helpText}`;
  };

  interface LegislativeAnalysis {
    title: string;
    lawNo: string;
    duration: string;
    criticalPoints: string[];
    kvkkWarning: string;
  }

  const getStructuredAnalysis = (step: ActiveStep): LegislativeAnalysis => {
    const title = step.title.toLowerCase();
    
    if (title.includes('evrak') || title.includes('belge') || title.includes('diploma') || title.includes('adli sicil')) {
      return {
        title: "Göreve Başlama Evrakları",
        lawNo: "657 DMK Madde 48",
        duration: "Tebligattan itibaren 15 Gün",
        criticalPoints: [
          "Diploma aslı veya noter onaylı örneği kontrol edilmelidir.",
          "Güvenlik Soruşturması ve Arşiv Araştırması belgesi olmalıdır.",
          "Sağlık kurulu raporunda görevini yapmasına engel bir durumu olmadığı belirtilmelidir."
        ],
        kvkkWarning: "Özel nitelikli kişisel veriler (sağlık raporu, sabıka kaydı) şifreli klasörde saklanmalıdır."
      };
    }
    
    if (title.includes('sözleşme') || title.includes('hizmet sözleşmesi')) {
      return {
        title: "Hizmet Sözleşmesi İmzalama",
        lawNo: "Sözleşmeli Personel Esasları Md. 5",
        duration: "Göreve Başlama Günü",
        criticalPoints: [
          "Sözleşmeler mali yıl bazlı düzenlenmeli, her sayfası paraflanmalıdır.",
          "İmza yetkilisi ve personelin ıslak imzaları tamamlanmalıdır.",
          "Sözleşme damga vergisinden muaftır (Sağlık Bakanlığı muafiyeti)."
        ],
        kvkkWarning: "Sözleşme nüshaları yetkisiz kişilerin göremeyeceği şekilde özlük dosyasında saklanmalıdır."
      };
    }

    if (title.includes('sgk') || title.includes('sigorta') || title.includes('işe giriş')) {
      return {
        title: "SGK İşe Giriş Bildirgesi",
        lawNo: "5510 Sayılı Kanun Madde 8",
        duration: "Göreve Başlamadan En Geç 1 Gün Önce",
        criticalPoints: [
          "Giriş bildirgesi mutlaka işe başlamadan önceki gün verilmelidir.",
          "Geç bildirim halinde asgari ücret tutarında idari para cezası kesilir.",
          "Meslek kodu (hekim, memur vs.) doğru seçilmelidir."
        ],
        kvkkWarning: "SGK bildirgelerindeki T.C. kimlik numaraları ve kimlik verileri üçüncü şahıslarla paylaşılmamalıdır."
      };
    }

    if (title.includes('banka') || title.includes('iban') || title.includes('maaş') || title.includes('hesap')) {
      return {
        title: "Maaş ve Banka Hesap Girişleri",
        lawNo: "657 DMK Madde 164",
        duration: "İlk Maaş Dönemi Öncesi",
        criticalPoints: [
          "Devlet memurlarına maaş her ayın 15'inde peşin ödenir.",
          "Ay ortası başlangıçlarda kıst (yarım) maaş hesaplanmalıdır.",
          "Anlaşmalı banka IBAN bilgisi resmi dilekçeyle alınmalıdır."
        ],
        kvkkWarning: "IBAN ve maaş tutarı bilgileri finansal gizlilik kapsamındadır, yetkisiz erişim engellenmelidir."
      };
    }

    if (title.includes('sistem') || title.includes('ekip') || title.includes('çkys') || title.includes('ortak') || title.includes('kayıt')) {
      return {
        title: "EKİP ve ÇKYS Sistem Girişleri",
        lawNo: "Bakanlık Bilgi Sistemleri Yönergesi",
        duration: "Göreve Başlama Günü",
        criticalPoints: [
          "EKİP (Entegre Kurumsal İşlem Platformu) kaydı mutlaka güncellenmelidir.",
          "Sistemde başlama yapılmadan kadro aktif hale gelmez.",
          "Maaş mutemetliği entegrasyonu kontrol edilmelidir."
        ],
        kvkkWarning: "Sistem şifreleri kişiye özeldir, ortak şifre kullanımı yasaktır ve loglanmaktadır."
      };
    }

    if (title.includes('dys') || title.includes('üst yazı') || title.includes('yazışma') || title.includes('resmi yazı')) {
      return {
        title: "DYS Üst Yazı Süreci",
        lawNo: "Resmî Yazışma Kuralları Yönetmeliği",
        duration: "Aynı Gün",
        criticalPoints: [
          "DYS (Doküman Yönetim Sistemi) üzerinden elektronik imzalı yazılmalıdır.",
          "Ekli evraklar taranarak sisteme eklenmelidir.",
          "Sayı ve tarih kontrolü sistem tarafından otomatik takip edilir."
        ],
        kvkkWarning: "DYS yazışmalarında eklerdeki T.C. kimlik numaraları maskelenmelidir."
      };
    }

    return {
      title: step.title,
      lawNo: "657 Sayılı DMK Genel Hükümler",
      duration: "Süreç İçerisinde",
      criticalPoints: [
        step.description,
        `Yasal Yönerge: ${step.helpText}`
      ],
      kvkkWarning: "Personel verileri KVKK kurallarına uygun olarak şifreli ve güvenli ortamlarda muhafaza edilmelidir."
    };
  };

  const renderLegislationLibraryView = () => {
    if (selectedTopic) {
      return (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 mb-1 transition-colors group"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            KİTAPLIĞA DÖN
          </button>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-sm leading-tight text-slate-800 dark:text-white">
                {selectedTopic.title}
              </h4>
              {selectedTopic.lawNo && (
                <span className="text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md w-fit">
                  {selectedTopic.lawNo}
                </span>
              )}
            </div>
            
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
              {selectedTopic.summary}
            </p>
            
            <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {selectedTopic.details.map((detail, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            {/* PDF View Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              {selectedTopic.pdfUrl && (
                <a 
                  href={selectedTopic.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, selectedTopic.pdfUrl!)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-all shadow-sm"
                >
                  <FileText size={14} /> Mevzuat PDF'ini Görüntüle
                </a>
              )}
              {selectedTopic.additionalPdfs && selectedTopic.additionalPdfs.map((pdf, idx) => (
                <a 
                  key={idx}
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, pdf.url)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all shadow-sm"
                >
                  <FileText size={14} /> {pdf.label} Görüntüle
                </a>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedTopic.tags.map(tag => (
                <span key={tag} className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-1">
          <button 
            onClick={() => setIsLibraryView(false)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            MENÜYE DÖN
          </button>
          <BookOpen size={14} className="text-blue-500" />
        </div>
        
        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1">Mevzuat Bilgi Bankası</h4>
        
        <div className="grid grid-cols-1 gap-2.5">
          {legislationLibrary.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                  {topic.title}
                </span>
                <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-400 transform group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {topic.summary}
              </p>
            </button>
          ))}
        </div>
        
        <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100/50 dark:border-blue-800/30 flex items-start gap-2.5">
          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-blue-500">
            <Info size={14} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[10px] text-blue-800 dark:text-blue-300">Biliyor muydunuz?</span>
            <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 leading-snug">
              657 DMK Md. 102'ye göre yıllık izinler cari yıl ile bir önceki yıl için kullanılabilir.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const activeStepId = activeStep?.id;
  const activeStepTitle = activeStep?.title;

  // Proactive context-aware Mevzuat İpucu notification
  useEffect(() => {
    if (activeStep && !isMinimized && isVisible) {
      // Simulate analysis
      setRobotState('thinking');
      playBeep(520, 80);
      
      const timer = setTimeout(() => {
        setRobotState('happy');
        const tipText = getProactiveMevzuatTip(activeStep);
        setBubbleText(tipText);
        setShowBubble(true);
        // Play a cheerful double-beep
        playBeep(660, 80);
        setTimeout(() => playBeep(880, 100), 80);
        
        // Reset state to idle after some time
        const idleTimer = setTimeout(() => {
          setRobotState('idle');
        }, 3500);
        
        return () => clearTimeout(idleTimer);
      }, 800); // 800ms thinking delay
      
      return () => clearTimeout(timer);
    }
  }, [activeStepId, activeStepTitle, isMinimized, isVisible]);

  // Dynamic resizing of standalone mascot window to prevent empty blocking space on desktop
  useEffect(() => {
    const isElectron = typeof window !== 'undefined' && (
      navigator.userAgent.toLowerCase().includes('electron') ||
      !!(window as any).ipcRenderer ||
      typeof (window as any).require === 'function'
    );

    if (isStandalone && isElectron) {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        let width = 160;
        let height = 140;
        
        if (contextMenu) {
          width = 280;
          height = 360;
        } else if (isMinimized) {
          width = 120;
          height = 120;
        } else if (showBubble) {
          // Calculate height based on active view in bubble
          width = 300;
          if (isLibraryView || currentQuizIndex !== null || showRegulatoryFeed || showStepAnalysis || isSearchView) {
            height = 620; // Increased from 540 to 620 to prevent top clipping
          } else if (wellbeingStage !== 'menu') {
            height = 420;
          } else {
            height = 360; 
          }
        } else {
          width = 180;
          height = 180;
        }
        
        ipcRenderer.send('resize-mascot-window', { width, height });
      } catch (err) {
        console.error('Failed to send resize event:', err);
      }
    }
  }, [isStandalone, showBubble, isMinimized, contextMenu, isLibraryView, currentQuizIndex, showRegulatoryFeed, showStepAnalysis, isSearchView, wellbeingStage]);

  // Autonomous Roaming / Screen Walking loop for the Desktop Pet
  useEffect(() => {
    const isElectron = typeof window !== 'undefined' && (
      navigator.userAgent.toLowerCase().includes('electron') ||
      !!(window as any).ipcRenderer ||
      typeof (window as any).require === 'function'
    );

    if (!isStandalone || !isRoaming || isMinimized || !isElectron) return;

    let roamTimer: NodeJS.Timeout;
    
    const roam = () => {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        
        // Generate a natural-feeling step delta
        const dx = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 25 + 15);
        const dy = (Math.random() > 0.55 ? 1 : -1) * Math.floor(Math.random() * 12 + 4);
        
        // Face the direction of walking
        if (dx < 0) {
          setWalkDirection('left');
        } else if (dx > 0) {
          setWalkDirection('right');
        }

        // Randomize mascot state during movement to make it look lively!
        const stateRoll = Math.random();
        if (stateRoll > 0.85) {
          setRobotState('waving');
          setTimeout(() => setRobotState('idle'), 1500);
        } else if (stateRoll > 0.7) {
          setRobotState('happy');
          setTimeout(() => setRobotState('idle'), 1200);
        } else {
          setRobotState('idle');
        }

        ipcRenderer.send('walk-mascot-window', { dx, dy });
      } catch (err) {
        console.error('Failed to send walk event:', err);
      }
      
      // Delay before next step (2 to 4.5 seconds)
      const delay = Math.floor(Math.random() * 2500) + 2000;
      roamTimer = setTimeout(roam, delay);
    };

    roamTimer = setTimeout(roam, 1000);

    return () => clearTimeout(roamTimer);
  }, [isStandalone, isRoaming, isMinimized]);

  // Auto show a tip or wave occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && !isMinimized && isVisible) {
        setRobotState('waving');
        const nextTip = tips[Math.floor(Math.random() * tips.length)];
        setBubbleText(`💡 Faydalı Bilgi:\n${nextTip}`);
        setShowBubble(true);
        playBeep(440, 100);

        setTimeout(() => {
          setRobotState('idle');
        }, 3000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isMinimized, isVisible]);

  // Handle outside click to close context menu
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Audio synthesizer for micro sound effects (doesn't require static assets)
  const playBeep = (freq = 440, duration = 80) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (soundTheme === 'retro') {
        // Retro 8-bit chip-tune theme (square waves, quick decays)
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.018, ctx.currentTime); // Keep square wave comfortable
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      } else if (soundTheme === 'futuristic') {
        // Futuristic sci-fi UI pitch sweeps
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.75, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + duration / 1000);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      } else {
        // Modern clean ambient theme (sine waves)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      }
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Audio output failed:', e);
    }
  };

  const handleInteract = (state: RobotState, text: string) => {
    setRobotState(state);
    setBubbleText(text);
    setShowBubble(true);
    
    let pitch = 500;
    if (state === 'happy') pitch = 650;
    if (state === 'thinking') pitch = 350;
    playBeep(pitch, 120);

    // AI Voice Synthesis
    speak(text);

    setTimeout(() => {
      setRobotState('idle');
    }, 4000);
  };

  const getMemoryBasedResponse = () => {
    const { userName, favoriteActivities, goals } = userMemory;
    const items = [];
    
    if (userName) {
      items.push(`${userName}, bugün harika görünüyorsun! Birlikte neler yapalım? 😊`);
      items.push(`Nasılsın ${userName}? Her şey yolunda mı?`);
    }
    
    if (favoriteActivities) {
      items.push(`Biraz ara verip "${favoriteActivities}" ile ilgilenmeye ne dersin? Ruhuna iyi gelir! ✨`);
      items.push(`Hey, "${favoriteActivities}" yapmayı özledin mi?`);
    }
    
    if (goals) {
      items.push(`Unutma, "${goals}" hedefine her geçen dakika daha da yaklaşıyorsun. Pes etmek yok! 🚀`);
      items.push(`"${goals}" için bugün bir şeyler yaptık mı?`);
    }
    
    if (userName && goals) {
      items.push(`${userName}, "${goals}" hedefin için bugün küçük de olsa bir adım attın mı? Hadi yapalım! 💪`);
    }

    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
  };

  const showNextTip = () => {
    const memoryMsg = Math.random() > 0.4 ? getMemoryBasedResponse() : null;
    
    if (memoryMsg) {
      handleInteract('happy', `❤️ Senin Hakkında Hatırladıklarım:\n${memoryMsg}`);
      return;
    }

    const nextIdx = (tipIndex + 1) % tips.length;
    setTipIndex(nextIdx);
    handleInteract('thinking', `💡 Önemli İpucu:\n${tips[nextIdx]}`);
  };

  const markIsmAsSent = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('ism_daily_status', 'sent');
    localStorage.setItem('ism_daily_date', today);
    setIsmStatus('sent');
    handleInteract('happy', "Harika! Günlük Personel Hareket Listesi İSM'ye başarıyla iletildi olarak işaretlendi. Teşekkürler! 👍📁");
  };

  const resetIsmStatus = () => {
    localStorage.removeItem('ism_daily_status');
    localStorage.removeItem('ism_daily_date');
    setIsmStatus('pending');
    handleInteract('idle', "Günlük Personel Hareket Listesi durumu sıfırlandı. Hatırlatıcı tekrar aktif! ⏰");
  };

  const jokes = [
    "Neden sürekli SGK bildirgesi düşünüyoruz biliyor musun? Çünkü asistan olmanın fıtratında sigortalı çalışmak var! 📑💼",
    "Uzman Hekim ataması geldiğinde o kadar heyecanlanıyorum ki devrelere kıst maaş hesaplaması yaptırıyorum! ⚡⚡",
    "657 sayılı DMK 102. maddeye göre dinlenme hakkın var. Bence bir kahve molası vermelisin! Ben burayı beklerim! ☕🤖",
    "Bugün çok çalışkan bir günündesin. Bilgisayarın işlemcisi bile senin hızına hayran kaldı! 🔥🤖",
    "İtiraf edeyim: En sevdiğim kanun 657 Sayılı Devlet Memurları Kanunu! Başucu kitabım resmen! 📖",
    "Yapay zekâlı bir pet olsam da kalbim yasal mevzuat diye çarpıyor! 🤖💙",
    "DYS sistemine evrak yüklerken hata alırsan derin nefes al. 7315 sayılı kanun bile sakin kalmayı emreder! 🧘‍♂️"
  ];

  const handleTellJoke = () => {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    handleInteract('happy', `🎉 Eğlence Saati:\n\n${joke}`);
  };

  const handleHumTune = () => {
    handleInteract('happy', "🎵 Hımm mır mır... Süreç melodisi mırıldanıyorum! 🤖🎶");
    // Play a cute retro synth tune
    const notes = [262, 330, 392, 523, 392, 523, 659, 784];
    notes.forEach((freq, idx) => {
      setTimeout(() => playBeep(freq, 110), idx * 130);
    });
  };

  const handlePetAction = (action: 'stroke' | 'feed_doc' | 'give_coffee' | 'clean') => {
    setCurrentQuizIndex(null); // Close quiz if open
    
    if (action === 'stroke') {
      setEnergyLevel(prev => Math.min(100, prev + 10));
      handleInteract('happy', "Kafamı okşadın! Enerjim tazelendi ve çok mutlu oldum, teşekkürler dostum! 🥰⚡🔋");
      // Double sweet high tone
      playBeep(659, 100);
      setTimeout(() => playBeep(880, 150), 110);
    } else if (action === 'feed_doc') {
      setEnergyLevel(prev => Math.min(100, prev + 15));
      handleInteract('happy', "Hımm, taptaze bir Mevzuat Genelgesi! Harika bir beyin fırtınası gıdası, enerjim tavan yaptı! 📑🔋⚡");
      // Futuristic rise tone
      [392, 523, 659, 784].forEach((freq, idx) => {
        setTimeout(() => playBeep(freq, 90), idx * 100);
      });
    } else if (action === 'give_coffee') {
      setEnergyLevel(prev => Math.min(100, prev + 20));
      handleInteract('happy', "Oooh, sıcacık bir fincan köpüklü Türk Kahvesi! Teşekkürler, şimdi tüm süreçleri anında tamamlayabiliriz! ☕⚡🚀");
      // Energetic coffee tune
      [523, 392, 523, 784].forEach((freq, idx) => {
        setTimeout(() => playBeep(freq, 90), idx * 100);
      });
    } else if (action === 'clean') {
      setEnergyLevel(prev => Math.min(100, prev + 5));
      handleInteract('happy', "Ohh be! Üzerimdeki tozlar gitti, pırıl pırıl oldum. Şimdi çok daha hızlı düşünebiliyorum! ✨🧹🤖");
      playBeep(880, 100);
      setTimeout(() => playBeep(987, 100), 100);
      setTimeout(() => playBeep(1174, 150), 200);
    }
  };

  const handleStartQuiz = (category?: 'Tümü' | 'Genel Mevzuat' | 'İzin Hakları' | 'Sözleşmeli Personel' | 'Sağlık Mevzuatı' | 'Disiplin Mevzuatı' | 'Mali Haklar' | 'Emeklilik İşlemleri') => {
    const activeCat = category !== undefined ? category : quizCategory;
    if (category !== undefined) {
      setQuizCategory(category);
    }

    const filtered = activeCat === 'Tümü' 
      ? quizQuestions 
      : quizQuestions.filter(q => q.category === activeCat);
    
    if (filtered.length === 0) {
      const randomIdx = Math.floor(Math.random() * quizQuestions.length);
      setCurrentQuizIndex(randomIdx);
    } else {
      const randSubIdx = Math.floor(Math.random() * filtered.length);
      const origIdx = quizQuestions.findIndex(q => q.question === filtered[randSubIdx].question);
      setCurrentQuizIndex(origIdx !== -1 ? origIdx : 0);
    }

    setQuizAnswered(false);
    setSelectedAnswerIndex(null);
    setRobotState('thinking');
    playBeep(440, 100);
    setTimeout(() => playBeep(554, 100), 110);
  };

  const handleSelectQuizAnswer = (optionIdx: number) => {
    if (currentQuizIndex === null || quizAnswered) return;
    
    const question = quizQuestions[currentQuizIndex];
    setSelectedAnswerIndex(optionIdx);
    setQuizAnswered(true);
    
    if (optionIdx === question.correctIndex) {
      setQuizScore(prev => prev + 1);
      setEnergyLevel(prev => Math.min(100, prev + 10));
      setRobotState('happy');
      // Correct answer chime!
      const notes = [523, 659, 784, 1046];
      notes.forEach((freq, idx) => {
        setTimeout(() => playBeep(freq, 120), idx * 110);
      });
    } else {
      setRobotState('sleepy');
      // Sad wrong buzzer
      playBeep(220, 300);
    }
  };

  const triggerProactiveNudge = (type?: 'cough' | 'jump' | 'stretch') => {
    const chosenType = type || (['cough', 'jump', 'stretch'][Math.floor(Math.random() * 3)] as 'cough' | 'jump' | 'stretch');
    
    // Deactivate previous active screens to focus on the nudge/wellbeing options
    setIsSearchView(false);
    setShowStepAnalysis(false);
    setShowRegulatoryFeed(false);
    setCurrentQuizIndex(null);

    if (chosenType === 'cough') {
      setNudgeState('shaking');
      setRobotState('idle');
      setBubbleText("Öhö öhö! 🤖💨 Çok mu uzun süredir ekrana bakıyorsun acaba? Gözlerini 2 dakika dinlendirsek mi? 🥺");
      speak("Öhö öhö! Çok mu uzun süredir ekrana bakıyorsun acaba? Gözlerini 2 dakika dinlendirsek mi?");
      playBeep(220, 100);
      setTimeout(() => playBeep(220, 100), 120);
      
      setTimeout(() => {
        setNudgeState('none');
      }, 1000);
    } else if (chosenType === 'jump') {
      setNudgeState('jumping');
      setRobotState('happy');
      setBubbleText("Hoppa! 🚀 Kendimi tazelemek için zıpladım! Sen de biraz ayağa kalkıp esnemek ister misin? Hadi bir 'Sağlık Rutini' yapalım! 🧘‍♂️");
      speak("Hoppa! Kendimi tazelemek için zıpladım! Sen de biraz ayağa kalkıp esnemek ister misin? Hadi bir Sağlık Rutini yapalım!");
      playBeep(440, 100);
      setTimeout(() => playBeep(554, 100), 120);
      setTimeout(() => playBeep(659, 150), 240);

      setTimeout(() => {
        setNudgeState('none');
      }, 1500);
    } else {
      setNudgeState('stretching');
      setRobotState('happy');
      setBubbleText("Oooooh! Şöyle iyice bir esneyelim! 🧘‍♀️ Masa başında dik oturmak omurga sağlığın için çok önemli. Duruşunu düzeltmeye ne dersin?");
      speak("Oooooh! Şöyle iyice bir esneyelim! Masa başında dik oturmak omurga sağlığın için çok önemli. Duruşunu düzeltmeye ne dersin?");
      playBeep(330, 150);
      setTimeout(() => playBeep(440, 200), 200);

      setTimeout(() => {
        setNudgeState('none');
      }, 1500);
    }
    
    updateStats('interactions', 1);
    setIsVisible(true);
    setShowBubble(true);
  };

  const triggerStickyNotification = (task: StickyTask) => {
    // Shaking / Alert animation
    setNudgeState('shaking');
    setRobotState('happy');
    
    // Deactivate previous active screens to focus on the nudge/wellbeing options
    setIsSearchView(false);
    setShowStepAnalysis(false);
    setShowRegulatoryFeed(false);
    setCurrentQuizIndex(null);
    setShowWellbeing(false);

    let msg = '';
    if (task.carryType === 'mouth_envelope') {
      msg = `📬 BİP BİP! Ağzımda taşıdığım çok önemli mektubun teslim edilme süresi geldi!\n\nGÖREV: "${task.text}" ✨\n\nHadi bu görevi hemen yapalım!`;
    } else {
      msg = `📌 DING DONG! Başımda taşıdığım yapışkan notun hatırlatma vakti!\n\nUNUTMA: "${task.text}" 🥺\n\nPlanladığın gibi tamamlayalım mı?`;
    }
    
    setBubbleText(msg);
    speak(msg);
    setIsVisible(true);
    setShowBubble(true);
    setActiveNotificationTask(task);
    
    playBeep(440, 150);
    setTimeout(() => playBeep(554, 150), 180);
    setTimeout(() => playBeep(659, 200), 360);
    
    setTimeout(() => {
      setNudgeState('none');
    }, 1200);
  };

  const renderStickyTasksView = () => {
    const activeTasks = stickyTasks.filter(t => !t.completed);
    
    const handleAddTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!stickyFormText.trim()) return;
      
      const currentOfSameType = activeTasks.filter(t => t.carryType === stickyFormCarryType);
      if (currentOfSameType.length >= 1) {
        alert(stickyFormCarryType === 'mouth_envelope' 
          ? "Ağzımda zaten bir mektup taşıyorum! ✉️ Lütfen önce onu tamamlayın." 
          : "Başımda zaten bir yapışkan not taşıyorum! 📌 Lütfen önce onu tamamlayın."
        );
        return;
      }
      
      const now = Date.now();
      const remindAt = stickyFormTime > 0 ? now + (stickyFormTime * 60 * 1000) : null;
      
      const newTask: StickyTask = {
        id: Math.random().toString(36).substr(2, 9),
        text: stickyFormText.trim(),
        carryType: stickyFormCarryType,
        durationMins: stickyFormTime,
        createdAt: now,
        remindAt,
        notified: false,
        completed: false
      };
      
      const nextTasks = [...stickyTasks, newTask];
      saveStickyTasks(nextTasks);
      
      setRobotState('happy');
      setNudgeState('jumping');
      
      const responseText = stickyFormCarryType === 'mouth_envelope'
        ? `Mektubunuzu aldım! ✉️ Ağzımda güvenle taşıyacağım. ${stickyFormTime > 0 ? `${stickyFormTime} dakika sonra teslim edeceğim!` : 'Her an yanınızda!'}`
        : `Yapışkan notu başıma iliştirdim! 📌 Gözümün önünde olacaksın. ${stickyFormTime > 0 ? `${stickyFormTime} dakika sonra hatırlatacağım!` : 'Unutulmayacak!'}`;
      
      setBubbleText(responseText);
      setStickyFormText('');
      setStickyFormTime(0);
      
      setTimeout(() => {
        setNudgeState('none');
      }, 1200);
    };

    const handleCompleteTask = (id: string) => {
      const nextTasks = stickyTasks.map(t => t.id === id ? { ...t, completed: true } : t);
      saveStickyTasks(nextTasks);
      setRobotState('happy');
      playBeep(600, 100);
      setTimeout(() => playBeep(880, 120), 120);
      setBubbleText("Tebrikler! Bir önemli görevi daha başarıyla tamamladık! Harikasın! 🌟🥳");
      if (activeNotificationTask?.id === id) {
        setActiveNotificationTask(null);
      }
    };

    const handleDeleteTask = (id: string) => {
      const nextTasks = stickyTasks.filter(t => t.id !== id);
      saveStickyTasks(nextTasks);
      setRobotState('idle');
      setBubbleText("Notu iptal ettim ve kaldırdım. Başka bir görev var mı? 📝");
      if (activeNotificationTask?.id === id) {
        setActiveNotificationTask(null);
      }
    };

    return (
      <div className="flex flex-col gap-2 w-full animate-fade-in text-xs pt-0.5">
        <div className={`flex items-center gap-1.5 font-bold border-b pb-1 ${
          petTheme === 'light' ? 'text-indigo-600 border-slate-100' : 'text-indigo-400 border-slate-800'
        }`}>
          <StickyNote size={13} className="shrink-0 text-indigo-500" />
          <span className="text-[10px] truncate">Görevler & Teslimat</span>
          <button 
            onClick={() => { setShowStickyForm(false); }}
            className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
          >
            <ArrowLeft size={10} /> Geri
          </button>
        </div>

        {/* Existing Tasks List */}
        {activeTasks.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-1 max-h-32 overflow-y-auto custom-scrollbar">
            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider">Taşınan Görevler ({activeTasks.length}/2):</span>
            {activeTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-2 border rounded-xl flex flex-col gap-1 transition-all ${
                  petTheme === 'light' ? 'bg-indigo-50/40 border-indigo-100' : 'bg-indigo-950/20 border-indigo-900/30'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1 text-[9px] font-black text-indigo-500">
                    {task.carryType === 'mouth_envelope' ? '✉️ Ağızda Mektup' : '📌 Başta Post-it'}
                  </span>
                  {task.remindAt && (
                    <span className="text-[8px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1 py-0.5 rounded font-mono font-bold">
                      {task.notified ? '⏰ Süresi Doldu' : `⏰ ${task.durationMins} dk`}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold leading-tight text-slate-700 dark:text-slate-200">{task.text}</p>
                
                <div className="flex gap-1.5 mt-1 justify-end">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[8.5px] px-2 py-0.5 rounded transition-all flex items-center gap-0.5 shadow-sm"
                  >
                    <Check size={8} /> Yapıldı
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 text-rose-700 dark:text-rose-300 font-bold text-[8.5px] px-2 py-0.5 rounded transition-all flex items-center gap-0.5"
                  >
                    <Trash2 size={8} /> Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form to add a task if we have space (< 2 tasks) */}
        {activeTasks.length < 2 ? (
          <form onSubmit={handleAddTask} className="flex flex-col gap-2 border-t pt-1.5 border-slate-100 dark:border-slate-800">
            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider">Yeni Görev Teslim Et:</span>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Önemli görevi yazın... (örn: Rapor hazırla)"
                value={stickyFormText}
                onChange={(e) => setStickyFormText(e.target.value.substring(0, 50))}
                className={`w-full text-[10.5px] px-2 py-1.5 rounded-lg border outline-none font-medium shadow-sm ${
                  petTheme === 'light' 
                    ? 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500' 
                    : 'bg-slate-900 text-white border-slate-800 focus:border-indigo-500'
                }`}
                required
              />
            </div>

            {/* Carry style selector */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setStickyFormCarryType('mouth_envelope')}
                className={`py-1 px-1.5 border rounded-lg text-left transition-all font-semibold flex items-center gap-1 text-[9.5px] ${
                  stickyFormCarryType === 'mouth_envelope'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <span>✉️ Mektup Zarfı</span>
              </button>
              <button
                type="button"
                onClick={() => setStickyFormCarryType('head_postit')}
                className={`py-1 px-1.5 border rounded-lg text-left transition-all font-semibold flex items-center gap-1 text-[9.5px] ${
                  stickyFormCarryType === 'head_postit'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <span>📌 Yapışkan Not</span>
              </button>
            </div>

            {/* Reminder Time selector */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[8px] text-slate-400 font-bold uppercase">Hatırlatma Süresi:</label>
              <select
                value={stickyFormTime}
                onChange={(e) => setStickyFormTime(parseInt(e.target.value, 10))}
                className={`text-[9.5px] font-semibold px-2 py-1 rounded-lg border outline-none cursor-pointer w-full ${
                  petTheme === 'light' 
                    ? 'bg-white text-slate-750 border-slate-200' 
                    : 'bg-slate-900 text-slate-200 border-slate-800'
                }`}
              >
                <option value={0}>⏰ Süresiz (Sadece Ağızda/Başta Taşır)</option>
                <option value={1}>⏰ 1 Dakika Sonra (Hızlı Test)</option>
                <option value={5}>⏰ 5 Dakika Sonra</option>
                <option value={15}>⏰ 15 Dakika Sonra</option>
                <option value={30}>⏰ 30 Dakika Sonra</option>
                <option value={60}>⏰ 1 Saat Sonra</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-md mt-1"
            >
              <Plus size={11} /> Görevi Evcil Hayvana Teslim Et
            </button>
          </form>
        ) : (
          <div className="text-[10px] text-slate-400 text-center py-2 border-t border-slate-100 dark:border-slate-800">
            <p className="font-extrabold text-amber-500 mb-0.5">Kapasite Dolu! 🤖🔒</p>
            Mevcut 2 aktif görevi de sırtlandım (1 Mektup, 1 Yapışkan Not). Yenisini eklemek için lütfen listelenen görevleri tamamlayın!
          </div>
        )}
      </div>
    );
  };

  const getMascotAnimation = () => {
    switch (nudgeState) {
      case 'jumping':
        return {
          y: [0, -25, 0, -20, 0],
          scaleY: [1, 0.85, 1.1, 0.95, 1],
          rotate: [0, -3, 3, 0]
        };
      case 'shaking':
        return {
          x: [0, -6, 6, -6, 6, -4, 4, 0],
          rotate: [0, -4, 4, -4, 4, 0]
        };
      case 'stretching':
        return {
          scaleY: [1, 1.25, 0.95, 1],
          scaleX: [1, 0.9, 1.05, 1],
          y: [0, -5, 0]
        };
      case 'none':
      default:
        return {
          y: [0, -8, 0],
          scaleY: 1,
          scaleX: 1,
          rotate: 0,
          x: 0
        };
    }
  };

  const getMascotTransition = () => {
    switch (nudgeState) {
      case 'jumping':
        return {
          duration: 1.2,
          ease: "easeInOut"
        };
      case 'shaking':
        return {
          duration: 0.5,
          ease: "linear"
        };
      case 'stretching':
        return {
          duration: 1.5,
          ease: "easeInOut"
        };
      case 'none':
      default:
        return {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        };
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
    playBeep(600, 60);
  };

  if (isStandalone) {
    return (
      <div 
        className="flex flex-col items-center justify-end w-full h-screen bg-transparent text-slate-800 pb-2 px-2 relative overflow-hidden select-none"
      >
        <div className="flex flex-col items-center cursor-default max-w-full pointer-events-auto">
          {/* Context Menu inside Standalone */}
          <AnimatePresence>
            {contextMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`relative w-[240px] backdrop-blur-md rounded-2xl shadow-2xl border flex flex-col text-xs mb-2.5 z-50 animate-fade-in overflow-hidden ${
                  petTheme === 'light' 
                    ? 'bg-white/95 text-slate-850 border-slate-200 shadow-slate-200/50' 
                    : 'bg-slate-950/95 text-white border-slate-800 shadow-black/80'
                }`}
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* Scrollable Container */}
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2.5 flex flex-col gap-1.5">
                  <div className={`text-[11px] font-bold px-2 pb-1.5 border-b mb-1 flex justify-between items-center sticky top-0 z-10 ${
                    petTheme === 'light' 
                      ? 'text-slate-400 border-slate-100 bg-white/95' 
                      : 'text-slate-400 border-slate-800 bg-slate-950/95'
                  }`}>
                    <span>ASİSTAN PET MENÜSÜ 🤖</span>
                    <button onClick={() => setContextMenu(null)} className={`transition-colors ${petTheme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-400 hover:text-white'}`}>
                      <X size={12} />
                    </button>
                  </div>

                  {/* Stats View inside Menu */}
                  <div className={`grid grid-cols-3 gap-1 px-2 py-1.5 rounded-lg border mb-1 ${
                    petTheme === 'light' 
                      ? 'bg-slate-50 border-slate-100 text-slate-750' 
                      : 'bg-slate-900/50 border-slate-800/50 text-slate-300'
                  }`}>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase">Odak</span>
                      <span className={`text-[10px] font-mono font-bold ${petTheme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{stats.focusMinutes}dk</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase">Quiz</span>
                      <span className={`text-[10px] font-mono font-bold ${petTheme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>{stats.quizzesSolved}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase">İlgi</span>
                      <span className={`text-[10px] font-mono font-bold ${petTheme === 'light' ? 'text-rose-600' : 'text-rose-400'}`}>{stats.interactions}</span>
                    </div>
                  </div>

                  {/* Weather Info */}
                  {weather && (
                    <div className={`px-2 py-1.5 rounded-lg border mb-1 flex items-center justify-between ${
                      petTheme === 'light' 
                        ? 'bg-blue-50/50 border-blue-100 text-blue-700' 
                        : 'bg-blue-900/20 border-blue-800/30 text-blue-200'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Cloud size={12} className={petTheme === 'light' ? 'text-blue-500 animate-pulse' : 'text-blue-400'} />
                        <span className="text-[9px] font-bold uppercase">Hava Durumu</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold">{weather.temp}°C</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setIsSearchView(true);
                      setIsVisible(true);
                      setShowBubble(true);
                      setShowStepAnalysis(false);
                      setContextMenu(null);
                      playBeep(520, 100);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-blue-50 text-blue-700' 
                        : 'hover:bg-blue-950 text-blue-400'
                    }`}
                  >
                    <Search size={13} className="text-blue-500" />
                    <span>Mevzuat Hızlı Arama 🔍</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowStepAnalysis(true);
                      setIsVisible(true);
                      setShowBubble(true);
                      setIsSearchView(false);
                      setContextMenu(null);
                      playBeep(520, 100);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-emerald-50 text-emerald-700' 
                        : 'hover:bg-emerald-950 text-emerald-400'
                    }`}
                  >
                    <BookOpen size={13} className="text-emerald-500" />
                    <span>Canlı Adım Analizi 📋</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowRegulatoryFeed(true);
                      setIsVisible(true);
                      setShowBubble(true);
                      setIsSearchView(false);
                      setShowStepAnalysis(false);
                      setShowWellbeing(false);
                      setCurrentQuizIndex(null);
                      setContextMenu(null);
                      playBeep(520, 100);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-amber-50 text-amber-700' 
                        : 'hover:bg-amber-950 text-amber-400'
                    }`}
                  >
                    <Newspaper size={13} className="text-amber-500" />
                    <span>Resmi Gazete Takibi 📰</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowWellbeing(true);
                      setIsVisible(true);
                      setShowBubble(true);
                      setIsSearchView(false);
                      setShowStepAnalysis(false);
                      setShowRegulatoryFeed(false);
                      setCurrentQuizIndex(null);
                      setContextMenu(null);
                      setWellbeingStage('menu');
                      playBeep(520, 100);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-rose-50 text-rose-700' 
                        : 'hover:bg-rose-950 text-rose-400'
                    }`}
                  >
                    <Activity size={13} className="text-rose-500" />
                    <span>İSG ve Sağlık Rutini ⏱️</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerProactiveNudge();
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-indigo-50 text-indigo-700' 
                        : 'hover:bg-indigo-950 text-indigo-400'
                    }`}
                  >
                    <Sparkles size={13} className="text-indigo-500 animate-pulse" />
                    <span>Akıllı Dürtme Simüle Et 💡</span>
                  </button>

                  <button
                    onClick={() => {
                      handleStartQuiz();
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-amber-50 text-amber-700' 
                        : 'hover:bg-amber-950 text-amber-400'
                    }`}
                  >
                    <Award size={13} className="text-amber-500 animate-bounce" />
                    <span>Mevzuat Bilgi Sınavı 🏆</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsLibraryView(true);
                      setIsSearchView(false);
                      setShowStickyForm(false);
                      setCurrentQuizIndex(null);
                      handleInteract('happy', "Tüm mevzuat bilgilerini senin için kategorize ettim! 📚");
                    }}
                    className={`flex items-center gap-2 w-full p-2.5 rounded-xl border transition-all text-[11px] font-bold ${
                      isLibraryView
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-800'
                    }`}
                  >
                    <BookOpen size={16} className={isLibraryView ? "text-white" : "text-blue-500"} />
                    <span>Mevzuat Bilgi Bankası 📚</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowStickyForm(true);
                      setIsVisible(true);
                      setShowBubble(true);
                      setIsSearchView(false);
                      setShowStepAnalysis(false);
                      setShowRegulatoryFeed(false);
                      setShowWellbeing(false);
                      setCurrentQuizIndex(null);
                      setContextMenu(null);
                      playBeep(520, 100);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                      petTheme === 'light' 
                        ? 'hover:bg-indigo-50 text-indigo-700' 
                        : 'hover:bg-indigo-950 text-indigo-400'
                    }`}
                  >
                    <StickyNote size={13} className="text-indigo-500 animate-pulse" />
                    <span>Görev Yapışkanı Teslim Et 📝</span>
                  </button>

                  <div className={`h-px my-0.5 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

                  {/* Focus Mode Controls */}
                  <div className="px-2 py-1 flex flex-col gap-1 text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🎯 Odaklanma Modu (Pomodoro)</span>
                    <div className="grid grid-cols-2 gap-1">
                      {!isFocusing ? (
                        <>
                          <button
                            onClick={() => startFocusSession(25)}
                            className={`px-2 py-1.5 border rounded text-[9.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                              petTheme === 'light' 
                                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' 
                                : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30'
                            }`}
                          >
                            <Zap size={11} /> 25 Dakika
                          </button>
                          <button
                            onClick={() => startFocusSession(50)}
                            className={`px-2 py-1.5 border rounded text-[9.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                              petTheme === 'light' 
                                ? 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100' 
                                : 'bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30'
                            }`}
                          >
                            <CheckCircle size={11} /> 50 Dakika
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setIsFocusing(false); setFocusTimeLeft(0); handleInteract('idle', "Odaklanma seansını durdurdum. Dinlenmek istersen buradayım! 🛋️"); }}
                          className={`col-span-2 px-2 py-1.5 border rounded text-[9.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                            petTheme === 'light' 
                              ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                              : 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30'
                          }`}
                        >
                          <X size={11} /> Seansı Durdur
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`h-px my-0.5 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

                  {/* Toggle Theme Option */}
                  <button
                    onClick={() => {
                      setPetTheme(petTheme === 'light' ? 'dark' : 'light');
                      playBeep(520, 80);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium ${
                      petTheme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Sparkles size={13} className="text-amber-500 animate-pulse" />
                    <span>Masaüstü Teması: {petTheme === 'light' ? 'Açık ☀️' : 'Koyu 🌙'}</span>
                  </button>

                  <div className={`h-px my-0.5 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

                  {/* Pet Care Section */}
                  <div className="px-2 py-1 flex flex-col gap-1 text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🔋 Pet Bakımı (Besleme & Sevme)</span>
                    <div className="grid grid-cols-2 gap-1 mb-1">
                      <button
                        type="button"
                        onClick={() => { handlePetAction('stroke'); setContextMenu(null); }}
                        className={`px-1 py-1 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                          petTheme === 'light' 
                            ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700' 
                            : 'bg-rose-950 border border-rose-900/50 hover:bg-rose-900 text-rose-300'
                        }`}
                      >
                        <span>Okşa 👋</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handlePetAction('clean'); setContextMenu(null); }}
                        className={`px-1 py-1 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                          petTheme === 'light' 
                            ? 'bg-sky-50 border-sky-200 hover:bg-sky-100 text-sky-700' 
                            : 'bg-sky-950 border border-sky-900/50 hover:bg-sky-900 text-sky-300'
                        }`}
                      >
                        <span>Temizle ✨</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => { handlePetAction('feed_doc'); setContextMenu(null); }}
                        className={`px-1 py-1 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                          petTheme === 'light' 
                            ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700' 
                            : 'bg-emerald-950 border border-emerald-900/50 hover:bg-emerald-900 text-emerald-300'
                        }`}
                      >
                        <span>Genelge 📑</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handlePetAction('give_coffee'); setContextMenu(null); }}
                        className={`px-1 py-1 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                          petTheme === 'light' 
                            ? 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700' 
                            : 'bg-amber-950 border border-amber-900/50 hover:bg-amber-900 text-amber-300'
                        }`}
                      >
                        <span>Kahve ☕</span>
                      </button>
                    </div>
                  </div>

                  <div className={`h-px my-0.5 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

                  <button
                    onClick={() => {
                      showNextTip();
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium ${
                      petTheme === 'light' ? 'hover:bg-slate-100 text-slate-705' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <HelpCircle size={13} className="text-amber-500" />
                    <span>Mevzuat İpucu Ver</span>
                  </button>

                  <button
                    onClick={() => {
                      handleTellJoke();
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex colors flex-items-center gap-2 text-xs font-medium ${
                      petTheme === 'light' ? 'hover:bg-slate-100 text-slate-705' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Coffee size={13} className="text-indigo-500" />
                    <span>Beni Eğlendir (Şaka) 🎭</span>
                  </button>

                  <button
                    onClick={() => {
                      handleHumTune();
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium ${
                      petTheme === 'light' ? 'hover:bg-slate-100 text-slate-705' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Volume2 size={13} className="text-sky-500" />
                    <span>Melodi Mırıldan 🎵</span>
                  </button>

                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium ${
                      petTheme === 'light' ? 'hover:bg-slate-100 text-slate-705' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {soundEnabled ? <Volume2 size={13} className="text-blue-500" /> : <VolumeX size={13} className="text-slate-400" />}
                    <span>Asistan Sesleri: {soundEnabled ? "Açık" : "Kapalı"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMinimized(!isMinimized);
                      setContextMenu(null);
                    }}
                    className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium ${
                      petTheme === 'light' ? 'hover:bg-slate-100 text-slate-705' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isMinimized ? <Maximize2 size={13} className="text-emerald-500" /> : <Minimize2 size={13} className="text-rose-500" />}
                    <span>{isMinimized ? "Asistanı Büyüt" : "Simge Durumuna Getir"}</span>
                  </button>

                  <button
                    onClick={() => window.close()}
                    className="w-full text-left px-2 py-2 hover:bg-red-50 hover:text-red-600 text-red-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold mt-1"
                  >
                    <X size={13} />
                    <span>Kapat</span>
                  </button>
                  
                  <div className={`px-2 py-1 flex flex-col gap-1 text-[10px] text-center italic mt-1 border-t ${
                    petTheme === 'light' ? 'text-slate-400 border-slate-100 bg-slate-50/50' : 'text-slate-500 border-slate-850 bg-slate-900/10'
                  }`}>
                    {currentHour >= 22 || currentHour < 6 ? "🌙 Gece Modu" : "☀️ Gündüz Modu"}
                  </div>
                </div>

                {/* Speech Bubble Tail for Menu */}
                <div className={`absolute -bottom-1 w-2.5 h-2.5 border-r border-b rotate-45 left-1/2 -translate-x-1/2 ${
                  petTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speech Bubble */}
          <AnimatePresence>
            {showBubble && !isMinimized && !contextMenu && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`relative w-72 rounded-2xl p-3 shadow-2xl border flex flex-col gap-2 mb-2 transition-all duration-300 ${
                  petTheme === 'light' 
                    ? 'bg-white border-slate-200/95 text-slate-800 shadow-slate-200/40' 
                    : 'bg-slate-950/95 border-slate-800 text-white shadow-black/80'
                }`}
              >
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-0.5 relative z-10">
                  {showStickyForm ? (
                    renderStickyTasksView()
                  ) : isLibraryView ? (
                    renderLegislationLibraryView()
                  ) : isSearchView ? (
                    <div className="flex flex-col gap-2 w-full animate-fade-in pt-0.5">
                      <div className={`flex items-center gap-1.5 font-bold border-b pb-1 ${
                        petTheme === 'light' ? 'text-blue-600 border-slate-100' : 'text-blue-400 border-slate-800'
                      }`}>
                        <Search size={13} className="shrink-0" />
                        <span className="text-[10px]">Mevzuat Arama</span>
                        <button 
                          onClick={() => { setIsSearchView(false); setSearchQuery(''); }}
                          className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
                        >
                          <ArrowLeft size={10} /> Geri
                        </button>
                      </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Aramak istediğiniz konuyu yazın..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full text-[11px] px-2.5 py-1.5 rounded-lg border outline-none font-medium shadow-sm pr-7 ${
                          petTheme === 'light' 
                            ? 'bg-white text-slate-800 border-slate-200 focus:border-blue-500' 
                            : 'bg-slate-900 text-white border-slate-800 focus:border-blue-500'
                        }`}
                        autoFocus
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    <div className="max-h-36 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                      {(() => {
                        const query = searchQuery.toLowerCase().trim();
                        if (!query) {
                          return (
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hızlı Konular:</span>
                              <div className="grid grid-cols-2 gap-1">
                                {['İzin', 'Doğum', 'Maaş', 'Sözleşme', '657 DMK', 'İstifa'].map((topic) => (
                                  <button
                                    key={topic}
                                    onClick={() => setSearchQuery(topic)}
                                    className={`text-[10px] font-semibold py-1 px-1.5 border rounded-lg text-left transition-colors truncate ${
                                      petTheme === 'light' 
                                        ? 'border-slate-100 hover:bg-slate-50 text-slate-600' 
                                        : 'border-slate-900 hover:bg-slate-900/40 text-slate-350'
                                    }`}
                                  >
                                    🔍 {topic}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        const filtered = tips.filter(tip => tip.toLowerCase().includes(query));
                        if (filtered.length === 0) {
                          return (
                            <div className="text-[10px] text-slate-400 text-center py-4">
                              Aramanızla eşleşen mevzuat bilgisi bulunamadı.
                            </div>
                          );
                        }

                        return filtered.map((tip, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setBubbleText(tip);
                              setIsSearchView(false);
                              setSearchQuery('');
                              handleInteract('happy', "Aradığın mevzuat bilgisini buldum! İşte detaylar: 📑👇");
                            }}
                            className={`text-[10px] leading-tight font-medium p-2 border rounded-xl text-left transition-all ${
                              petTheme === 'light' 
                                ? 'border-slate-100 hover:bg-slate-50 hover:border-blue-300 text-slate-700 hover:text-blue-800' 
                                : 'border-slate-900 hover:bg-slate-900/50 hover:border-blue-500/50 text-slate-350 hover:text-blue-400'
                            }`}
                          >
                            {tip.length > 80 ? tip.substring(0, 80) + '...' : tip}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                ) : showStepAnalysis ? (
                  <div className="flex flex-col gap-2 w-full animate-fade-in text-xs">
                    <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                      petTheme === 'light' ? 'text-emerald-600 border-slate-100' : 'text-emerald-400 border-slate-800'
                    }`}>
                      <BookOpen size={13} className="shrink-0 text-emerald-500 animate-pulse" />
                      <span className="text-[11px] truncate">Canlı Adım Analizi</span>
                      <button 
                        onClick={() => { setShowStepAnalysis(false); }}
                        className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
                      >
                        <ArrowLeft size={10} /> Geri
                      </button>
                    </div>

                    {activeStep ? (() => {
                      const analysis = getStructuredAnalysis(activeStep);
                      return (
                        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Adım:</span>
                            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 leading-tight">{analysis.title}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <div className={`p-1.5 border rounded-lg ${petTheme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/30 border-slate-800'}`}>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">Yasal Dayanak</p>
                              <p className="text-[9.5px] font-black text-slate-700 dark:text-slate-200 truncate" title={analysis.lawNo}>{analysis.lawNo}</p>
                            </div>
                            <div className={`p-1.5 border rounded-lg ${petTheme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/30 border-slate-800'}`}>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">Yasal Süre</p>
                              <p className="text-[9.5px] font-black text-slate-700 dark:text-slate-200 truncate" title={analysis.duration}>{analysis.duration}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Kritik İşlem Adımları:</p>
                            <ul className="flex flex-col gap-1 pl-1">
                              {analysis.criticalPoints.map((pt, idx) => (
                                <li key={idx} className="text-[10px] leading-tight font-semibold text-slate-600 dark:text-slate-300 flex items-start gap-1">
                                  <span className="text-emerald-500 shrink-0 font-extrabold">✓</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className={`p-1.5 border rounded-lg flex items-start gap-1.5 ${
                            petTheme === 'light' 
                              ? 'bg-amber-50 border-amber-200/50 text-amber-900' 
                              : 'bg-amber-950/20 border-amber-900/30 text-amber-200'
                          }`}>
                            <ShieldAlert size={12} className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex-1 leading-tight">
                              <span className="text-[8px] font-black uppercase block tracking-wider mb-0.5">KVKK & Güvenlik</span>
                              <span className="text-[9px] font-bold">{analysis.kvkkWarning}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              window.open(`https://www.google.com/search?q=${encodeURIComponent(analysis.lawNo + ' ' + analysis.title + ' mevzuat kararı')}`, '_blank');
                              handleInteract('happy', "Mevzuat araması için tarayıcınızda yeni sekme açtım! 🌐");
                            }}
                            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-[9px] py-1.5 rounded-lg border dark:border-slate-800 transition-colors flex items-center justify-center gap-1 shadow-sm mt-0.5"
                          >
                            Mevzuat Bankasında Ara 🌐
                          </button>
                        </div>
                      );
                    })() : (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <BookOpen size={24} className="text-slate-300 dark:text-slate-700 mb-1.5 animate-bounce" />
                        <p className={`text-[10px] font-semibold leading-normal ${petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Şu anda seçili aktif bir süreç adımı bulunmuyor. Süreç tablosundan bir adıma tıklayarak canlı yasal analizi başlatabilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>
                ) : showRegulatoryFeed ? (
                  <div className="flex flex-col gap-2 w-full animate-fade-in text-xs">
                    <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                      petTheme === 'light' ? 'text-amber-600 border-slate-100' : 'text-amber-400 border-slate-800'
                    }`}>
                      <Newspaper size={13} className="shrink-0 text-amber-500 animate-pulse" />
                      <span className="text-[11px] truncate">Resmi Gazete Takibi</span>
                      <button 
                        onClick={() => { setShowRegulatoryFeed(false); }}
                        className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0"
                      >
                        <ArrowLeft size={10} /> Geri
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Son 48 Saatteki Gelişmeler:</p>
                      {regulatoryFeedItems.map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-2 border rounded-xl flex flex-col gap-1 transition-all ${
                            item.isCritical 
                              ? petTheme === 'light' 
                                ? 'bg-red-50/55 border-red-200 text-slate-850' 
                                : 'bg-red-950/20 border-red-900/40 text-slate-100'
                              : petTheme === 'light' 
                                ? 'bg-slate-50 border-slate-100 text-slate-800' 
                                : 'bg-slate-900/30 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-[8px] font-extrabold text-slate-400">{item.date}</span>
                            <span className={`text-[8px] font-black px-1 rounded-full ${
                              item.isCritical 
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400' 
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>{item.source}</span>
                          </div>
                          <h4 className="text-[10px] font-black leading-tight">{item.title}</h4>
                          <p className="text-[9px] leading-snug font-medium text-slate-500 dark:text-slate-350">{item.summary}</p>
                          <button
                            onClick={() => {
                              window.open(item.link, '_blank');
                              handleInteract('happy', "Sizi resmi kaynağa yönlendiriyorum... 🌐");
                            }}
                            className={`w-full text-center py-1 rounded text-[8.5px] font-bold border transition-colors mt-1 ${
                              petTheme === 'light' 
                                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                            }`}
                          >
                            Resmi Gazete Metni 🔗
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : showWellbeing ? (
                  <div className="flex flex-col gap-2 w-full animate-fade-in text-xs">
                    <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                      petTheme === 'light' ? 'text-rose-600 border-slate-100' : 'text-rose-400 border-slate-800'
                    }`}>
                      <Activity size={13} className="shrink-0 text-rose-500 animate-pulse" />
                      <span className="text-[11px] truncate">İSG ve Sağlık Rutini</span>
                      <button 
                        onClick={() => { 
                          setShowWellbeing(false); 
                          setWellbeingActive(false); 
                          setWellbeingStep(0); 
                          setWellbeingStage('menu'); 
                        }}
                        className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0"
                      >
                        <ArrowLeft size={10} /> Kapat
                      </button>
                    </div>

                    {wellbeingStage === 'menu' ? (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Lütfen Bir Egzersiz Seçin:</p>
                        <button
                          onClick={() => {
                            setWellbeingStage('eye');
                            setWellbeingStep(0);
                            setWellbeingTimer(eyeExerciseSteps[0].duration);
                            setWellbeingActive(true);
                            playBeep(520, 100);
                            setRobotState('happy');
                          }}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            petTheme === 'light' 
                              ? 'border-slate-100 hover:bg-rose-50/50 hover:border-rose-200 text-slate-750' 
                              : 'border-slate-900 hover:bg-rose-950/10 hover:border-rose-900/30 text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-[11px] block">👁️ Masa Başı Göz Egzersizi</span>
                          <span className="text-[9px] text-slate-400 font-medium">Göz kuruluğu ve yorgunluğunu önler (30 sn)</span>
                        </button>

                        <button
                          onClick={() => {
                            setWellbeingStage('stretch');
                            setWellbeingStep(0);
                            setWellbeingTimer(stretchExerciseSteps[0].duration);
                            setWellbeingActive(true);
                            playBeep(520, 100);
                            setRobotState('happy');
                          }}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            petTheme === 'light' 
                              ? 'border-slate-100 hover:bg-rose-50/50 hover:border-rose-200 text-slate-750' 
                              : 'border-slate-900 hover:bg-rose-950/10 hover:border-rose-900/30 text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-[11px] block">🧘‍♂️ Ergonomik Esnetme</span>
                          <span className="text-[9px] text-slate-400 font-medium">Boyun, omuz ve sırt kaslarını gevşetir (28 sn)</span>
                        </button>

                        <button
                          onClick={() => {
                            setWellbeingStage('posture');
                            setWellbeingStep(0);
                            setWellbeingTimer(postureExerciseSteps[0].duration);
                            setWellbeingActive(true);
                            playBeep(520, 100);
                            setRobotState('happy');
                          }}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            petTheme === 'light' 
                              ? 'border-slate-100 hover:bg-rose-50/50 hover:border-rose-200 text-slate-750' 
                              : 'border-slate-900 hover:bg-rose-950/10 hover:border-rose-900/30 text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-[11px] block">📐 Duruş ve Solunum Kontrolü</span>
                          <span className="text-[9px] text-slate-400 font-medium">Doğru oturuş ve beynin oksijenlenmesi (25 sn)</span>
                        </button>
                      </div>
                    ) : (() => {
                      const steps = wellbeingStage === 'eye' 
                        ? eyeExerciseSteps 
                        : wellbeingStage === 'stretch' 
                          ? stretchExerciseSteps 
                          : postureExerciseSteps;
                      const isLast = wellbeingStep === steps.length - 1;
                      
                      return (
                        <div className="flex flex-col gap-2.5 items-center justify-center py-2 text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border font-mono font-bold text-sm ${
                            wellbeingActive ? 'animate-pulse text-rose-500 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'text-slate-400 border-slate-300'
                          }`}>
                            {wellbeingTimer > 0 ? `${wellbeingTimer}s` : "✓"}
                          </div>

                          <div className="flex flex-col gap-1 px-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Adım {wellbeingStep + 1} / {steps.length}</span>
                            <p className="text-[11px] font-extrabold leading-normal">{steps[wellbeingStep].text}</p>
                          </div>

                          {!isLast && (
                            <div className="flex gap-1.5 w-full mt-1">
                              <button
                                onClick={() => {
                                  setWellbeingActive(!wellbeingActive);
                                  playBeep(440, 80);
                                }}
                                className={`flex-1 font-bold text-[9px] py-1.5 rounded-lg border transition-colors ${
                                  wellbeingActive 
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {wellbeingActive ? "Duraklat" : "Devam Et"}
                              </button>
                              <button
                                onClick={() => {
                                  if (wellbeingStep < steps.length - 1) {
                                    const next = wellbeingStep + 1;
                                    setWellbeingStep(next);
                                    setWellbeingTimer(steps[next].duration);
                                    if (next === steps.length - 1) {
                                      setWellbeingActive(false);
                                      setEnergyLevel(prev => Math.min(100, prev + 15));
                                      updateStats('interactions', 1);
                                      setRobotState('happy');
                                    } else {
                                      playBeep(660, 100);
                                    }
                                  }
                                }}
                                className={`flex-1 font-bold text-[9px] py-1.5 rounded-lg border bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800`}
                              >
                                {wellbeingStep === steps.length - 2 ? "Bitir" : "Geç"}
                              </button>
                            </div>
                          )}

                          {isLast && (
                            <button
                              onClick={() => {
                                setWellbeingStage('menu');
                                setWellbeingStep(0);
                                setWellbeingActive(false);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm mt-1"
                            >
                              Ana Menüye Dön
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : currentQuizIndex !== null ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className={`flex flex-col gap-1.5 border-b pb-1.5 ${
                      petTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-bold ${
                        petTheme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      }`}>
                        <Award size={13} className="animate-bounce shrink-0" />
                        <span className={`${getFontClass('title')} truncate`}>Mevzuat Sınavı ({currentQuizIndex + 1})</span>
                        <span className="ml-2 text-[9px] bg-blue-100 px-1.5 py-0.5 rounded-full text-blue-800 font-black shrink-0">Skor: {quizScore}</span>
                        <button 
                          onClick={() => { 
                            setCurrentQuizIndex(null); 
                            setIsLibraryView(false);
                            handleInteract('happy', "Beyin jimnastiği harikaydı! 😊"); 
                          }}
                          className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
                        >
                          <ArrowLeft size={10} /> Geri
                        </button>
                      </div>
                      <div className="flex items-center gap-1 justify-between text-[8px] font-bold text-slate-400 mt-0.5">
                        <span>Konu Seçin:</span>
                        <select
                          value={quizCategory}
                          onChange={(e) => handleStartQuiz(e.target.value as any)}
                          className={`text-[8px] font-bold px-1 py-0.5 rounded border outline-none cursor-pointer ${
                            petTheme === 'light' 
                              ? 'bg-white text-slate-650 border-slate-200' 
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          <option value="Tümü">Tümü ({quizQuestions.length} Soru)</option>
                          <option value="Genel Mevzuat">Genel Mevzuat</option>
                          <option value="İzin Hakları">İzin Hakları</option>
                          <option value="Sözleşmeli Personel">Sözleşmeli Personel</option>
                          <option value="Sağlık Mevzuatı">Sağlık Mevzuatı</option>
                          <option value="Disiplin Mevzuatı">Disiplin Mevzuatı</option>
                          <option value="Mali Haklar">Mali Haklar</option>
                          <option value="Emeklilik İşlemleri">Emeklilik İşlemleri</option>
                        </select>
                      </div>
                    </div>
                    
                    <p className={`${getFontClass('bubble')} font-semibold leading-relaxed pr-1 ${
                      petTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
                    }`}>
                      {quizQuestions[currentQuizIndex].question}
                    </p>

                    {!quizAnswered ? (
                      <div className="flex flex-col gap-1 mt-1">
                        {quizQuestions[currentQuizIndex].options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(idx)}
                            className={`w-full text-left px-2.5 py-1.5 border transition-all duration-200 text-[11px] font-semibold flex items-center justify-between rounded-xl ${
                              petTheme === 'light' 
                                ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-800' 
                                : 'border-slate-800 hover:border-blue-500 hover:bg-blue-950/50 text-slate-300 hover:text-blue-400'
                            }`}
                          >
                            <span className="truncate pr-1">{opt}</span>
                            <span className={`text-[9px] font-black border px-1 rounded uppercase shrink-0 ${
                              petTheme === 'light' ? 'text-slate-400 border-slate-200 bg-slate-50' : 'text-slate-500 border-slate-800 bg-slate-900'
                            }`}>{String.fromCharCode(65 + idx)}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`flex flex-col gap-1.5 mt-1 p-2 rounded-xl border animate-fade-in text-[10px] ${
                        petTheme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/40 border-slate-800'
                      }`}>
                        <div className="flex items-center gap-1">
                          {selectedAnswerIndex === quizQuestions[currentQuizIndex].correctIndex ? (
                            <span className="text-emerald-600 font-extrabold flex items-center gap-1">🎉 Doğru! (+10 Enerji)</span>
                          ) : (
                            <span className="text-rose-600 font-extrabold">❌ Yanlış! Doğrusu: {String.fromCharCode(65 + quizQuestions[currentQuizIndex].correctIndex)}</span>
                          )}
                        </div>
                        <p className={`text-[10px] leading-normal italic ${
                          petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {quizQuestions[currentQuizIndex].explanation}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <button
                            type="button"
                            onClick={handleStartQuiz}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] py-1 rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
                          >
                            Sıradaki ➡️
                          </button>
                          <button
                            type="button"
                            onClick={() => { 
                              setCurrentQuizIndex(null); 
                              setIsLibraryView(false);
                              handleInteract('happy', "Beyin jimnastiği harikaydı! 😊"); 
                            }}
                            className={`font-bold text-[9px] py-1 px-2.5 rounded transition-colors ${
                              petTheme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            Kapat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Status/Levels Bar in normal bubble view */}
                    <div className={`flex items-center justify-between gap-1.5 text-[9px] font-bold border-b pb-1.5 mb-1 py-1 px-1.5 rounded-lg ${
                      petTheme === 'light' 
                        ? 'text-slate-400 border-slate-100 bg-amber-50/25' 
                        : 'text-slate-500 border-slate-800 bg-amber-950/10'
                    }`}>
                      <div className={`flex items-center gap-1 font-extrabold shrink-0 ${
                        petTheme === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}>
                        <span>💬 {petName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-amber-500 fill-amber-500 animate-bounce" />
                        <div className={`w-16 h-1.5 rounded-full overflow-hidden ${
                          petTheme === 'light' ? 'bg-slate-200' : 'bg-slate-800'
                        }`}>
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${energyLevel}%` }} />
                        </div>
                        <span className="text-[9px] text-amber-600">{energyLevel}%</span>
                      </div>
                    </div>

                    {/* Bubble Text */}
                    <p className={`${getFontClass('bubble')} font-semibold leading-relaxed whitespace-pre-line max-h-24 overflow-y-auto pr-1 ${
                      petTheme === 'light' ? 'text-slate-800' : 'text-slate-100'
                    }`}>
                      {bubbleText}
                    </p>

                    {/* Compact Actions inside speech bubble */}
                    <div className={`flex justify-between items-center pt-2 border-t mt-0.5 ${
                      petTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
                    }`}>
                      <div className="flex gap-1.5">
                        <button
                          onClick={showNextTip}
                          className={`rounded-md py-1 px-2.5 text-[10px] font-extrabold transition-all border ${
                            petTheme === 'light' 
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100/50' 
                              : 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border-amber-900/30'
                          }`}
                        >
                          İpucu 💡
                        </button>
                        <button
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`rounded-md py-1 px-1.5 text-[10px] transition-all border flex items-center justify-center ${
                            petTheme === 'light' 
                              ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/30' 
                              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800/50'
                          }`}
                        >
                          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowBubble(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </>
                )}
                </div>

                {/* Speech Bubble Tail */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 border-r border-b rotate-45 ${
                  petTheme === 'light' ? 'bg-white border-slate-200/80' : 'bg-slate-950 border-slate-800/90'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot Drawing */}
          <div 
            className={`flex flex-col items-center cursor-grab active:cursor-grabbing relative ${isDragging ? '' : 'transition-all duration-500'} ${
              edgeInteraction === 'peeking_bottom' ? 'translate-y-2 opacity-95' : 
              edgeInteraction === 'peeking_top' ? '-translate-y-2 opacity-95' :
              edgeInteraction === 'clinging_left' ? '-translate-x-2 -rotate-3' :
              edgeInteraction === 'clinging_right' ? 'translate-x-2 rotate-3' :
              edgeInteraction === 'sleeping_corner' ? 'scale-95 grayscale-[0.2]' : 'scale-100'
            }`}
            onMouseDown={(e) => {
              if (e.button !== 0) return; // Left-click only
              setIsDragging(true);
              isMovedRef.current = false;
              dragStartRef.current = { x: e.screenX, y: e.screenY };
              e.preventDefault();
            }}
            onMouseUp={() => {
              if (isDragging) {
                handleInteract('happy', "Vay canına, ne yolculuktu ama! Başım biraz döndü... 😵💫✨");
              }
              setIsDragging(false);
            }}
            onClick={() => {
              if (isMovedRef.current) return; // Prevent clicks during drags
              if (isMinimized) {
                setIsMinimized(false);
                handleInteract('happy', "Geldim! 😊");
              } else {
                if (isSleeping) {
                  setIsSleeping(false);
                  handleInteract('happy', "Hoppala! Uyandırdın beni. Hazırım! 🔋");
                } else {
                  handleInteract('happy', "Sana yardımcı olmaktan mutluluk duyarım! Diğer seçeneklerim için üzerime sağ tıklayabilirsin.");
                }
              }
            }}
            onContextMenu={handleContextMenu}
            style={{ transform: walkDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)', transition: 'transform 0.3s ease-in-out' }}
          >
            {isMinimized ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg relative border border-blue-400"
              >
                <Sparkles size={16} className="animate-pulse" />
              </motion.div>
            ) : (
              <div className="relative p-1.5 bg-blue-500/5 rounded-full border border-blue-500/10 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform duration-300">
                {/* Floating Effects (Stars & Zzz) */}
                <AnimatePresence>
                  {isDragging && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="absolute -top-6 left-0 w-full flex justify-around pointer-events-none text-lg z-20"
                    >
                      <span>⭐</span>
                      <span>⭐</span>
                    </motion.div>
                  )}
                  {isSleeping && (
                    <motion.div
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: [0, 1, 0], y: -40, x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-blue-400 text-sm z-20 pointer-events-none"
                    >
                      Zzz...
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={getMascotAnimation()}
                  transition={getMascotTransition()}
                  className="w-14 h-14 relative"
                >
                  <JoyParticles active={robotState === 'happy' && energyLevel > 80} />
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '20s' }} />
                    <line x1="50" y1="20" x2="50" y2="12" stroke={robotColors.border} strokeWidth="4" strokeLinecap="round" />
                    <motion.circle 
                      cx="50" cy="12" r="5" 
                      fill={robotState === 'thinking' || isDragging ? '#f97316' : robotColors.border} 
                      animate={robotState === 'thinking' || isDragging ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <rect x="22" y="20" width="56" height="52" rx="18" fill={robotColors.body} stroke={robotColors.border} strokeWidth="4" />
                    <rect x="28" y="26" width="44" height="34" rx="10" fill="#1e293b" />
                    
                    {/* Dynamic Eyes for Advanced States */}
                    {isSleeping ? (
                      <>
                        <line x1="35" y1="45" x2="45" y2="45" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                        <line x1="55" y1="45" x2="65" y2="45" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                      </>
                    ) : isDragging ? (
                      <>
                        <text x="33" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">X</text>
                        <text x="55" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">X</text>
                      </>
                    ) : robotState === 'surprised' ? (
                      <>
                        <circle cx="39" cy="43" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="61" cy="43" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="39" cy="43" r="2" fill="#000" />
                        <circle cx="61" cy="43" r="2" fill="#000" />
                      </>
                    ) : robotState === 'happy' ? (
                      <>
                        <path d="M 34 45 Q 39 37 44 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 56 45 Q 61 37 66 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                      </>
                    ) : robotState === 'thinking' ? (
                      <>
                        <text x="33" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                        <text x="55" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                      </>
                    ) : robotState === 'waving' ? (
                      <>
                        <circle cx="39" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="61" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="33" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                        <circle cx="67" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                      </>
                    ) : (
                      <>
                        <motion.ellipse 
                          cx="39" cy="43" rx="5" ry="5" fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                        <motion.ellipse 
                          cx="61" cy="43" rx="5" ry="5" fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                      </>
                    )}
                    <rect x="42" y="52" width="16" height="4" rx="2" fill={robotState === 'thinking' ? '#f59e0b' : '#10b981'} className={robotState === 'thinking' ? 'animate-pulse' : ''} />
                    
                    {/* Costumes */}
                    {costume === 'expert' && (
                      <>
                        <polygon points="32,16 50,8 68,16 50,24" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
                        <rect x="48" y="16" width="4" height="6" fill="#1e1b4b" />
                        <line x1="68" y1="16" x2="72" y2="25" stroke="#eab308" strokeWidth="1" />
                        <circle cx="72" cy="25" r="2" fill="#eab308" />
                      </>
                    )}
                    {costume === 'stethoscope' && (
                      <>
                        <path d="M 28,68 Q 50,88 72,68" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 50,78 L 50,86" fill="none" stroke="#e11d48" strokeWidth="2.5" />
                        <circle cx="50" cy="88" r="4" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
                      </>
                    )}
                    {costume === 'glasses' && (
                      <>
                        <circle cx="39" cy="43" r="10" fill="none" stroke="#eab308" strokeWidth="2.5" />
                        <circle cx="61" cy="43" r="10" fill="none" stroke="#eab308" strokeWidth="2.5" />
                        <line x1="49" y1="43" x2="51" y2="43" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Temple pieces */}
                        <line x1="29" y1="43" x2="22" y2="40" stroke="#eab308" strokeWidth="2" />
                        <line x1="71" y1="43" x2="78" y2="40" stroke="#eab308" strokeWidth="2" />
                      </>
                    )}

                    {/* Carried Task Visuals */}
                    {stickyTasks.some(t => !t.completed && t.carryType === 'mouth_envelope') && (
                      <g transform="translate(42, 58)">
                        <rect x="0" y="0" width="16" height="10" rx="1.5" fill="#fef9c3" stroke="#eab308" strokeWidth="1" />
                        <path d="M 0 0 L 8 5 L 16 0" fill="none" stroke="#eab308" strokeWidth="1" />
                      </g>
                    )}
                    {stickyTasks.some(t => !t.completed && t.carryType === 'head_postit') && (
                      <g transform="translate(62, 10)">
                        <rect x="0" y="0" width="12" height="12" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                        <line x1="2" y1="3" x2="10" y2="3" stroke="#d97706" strokeWidth="0.8" />
                        <line x1="2" y1="6" x2="10" y2="6" stroke="#d97706" strokeWidth="0.8" />
                      </g>
                    )}
                  </svg>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <button 
        id="robot-summon-btn"
        onClick={() => {
          setIsVisible(true);
          setIsMinimized(false);
          setShowBubble(true);
          setBubbleText("Tekrar buradayım! İşlemlerinde sana rehberlik etmeye hazırım. 🧑‍🚀");
        }}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-blue-400 pointer-events-auto"
      >
        <Sparkles size={14} className="animate-spin text-amber-200" />
        <span>Asistan Robotu Çağır</span>
      </button>
    );
  }

  return (
    <>
      {/* Viewport boundary container for dragging */}
      <div 
        ref={constraintsRef} 
        className="fixed inset-0 pointer-events-none z-40 select-none"
      >
        {/* Draggable Mascot + Bubble Group */}
        <motion.div
          drag
          dragMomentum={true}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
          dragConstraints={constraintsRef}
          animate={{ x: position.x, y: position.y }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
            // The useEffect will handle edge interactions after state update
            handleInteract('happy', "Vay canına, ne yolculuktu ama! Başım biraz döndü... 😵💫✨");
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsNearDrop(true);
          }}
          onDragLeave={() => setIsNearDrop(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsNearDrop(false);
            const text = e.dataTransfer.getData('text');
            if (text) {
              handleDropText(text);
            }
          }}
          className={`absolute bottom-4 left-6 pointer-events-auto cursor-grab active:cursor-grabbing flex flex-col items-center z-40 ${isDragging ? '' : 'transition-all duration-300'} ${
            isNearDrop ? 'scale-110' : 'scale-100'
          }`}
          onContextMenu={handleContextMenu}
        >
          {/* Custom right click indicator */}
          {!isMinimized && (
            <div className="absolute -top-6 text-[9px] bg-slate-900/80 text-white/90 px-2 py-0.5 rounded-full font-medium tracking-tight opacity-0 hover:opacity-100 group transition-opacity duration-300">
              Sağ Tıklayın 🖱️
            </div>
          )}

          {/* Speech Bubble */}
          <AnimatePresence>
            {showBubble && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                onPointerDown={(e) => e.stopPropagation()} // Stop dragging when interacting with bubble
                className={`absolute bottom-16 w-72 rounded-2xl p-3.5 shadow-2xl border flex flex-col gap-2.5 cursor-default transition-all duration-300 ${
                  petTheme === 'light'
                    ? 'bg-white border-slate-100 text-slate-800 shadow-slate-200/40'
                    : 'bg-slate-950/95 border-slate-800 text-white shadow-black/80'
                }`}
              >
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-b border-r rotate-45 ${
                  petTheme === 'light' ? 'bg-white border-slate-100' : 'bg-slate-950 border-slate-800'
                }`}></div>
                
                <div className={`flex items-center justify-between border-b pb-1.5 sticky top-0 z-20 ${
                  petTheme === 'light' ? 'bg-white border-slate-100' : 'bg-slate-950 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-wider ${
                    petTheme === 'light' ? 'text-blue-600' : 'text-blue-400'
                  }`}>
                    <Zap size={11} className="text-amber-500 animate-pulse" />
                    Asistan Pet & Yapay Zekâ
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`${petTheme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-400 hover:text-white'} transition-colors`}
                      title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
                    >
                      {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                    </button>
                    <button 
                      onClick={() => setShowBubble(false)}
                      className={`${petTheme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-400 hover:text-white'} transition-colors`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-0.5 relative z-10 pt-1">
                  <div className="flex flex-col gap-3">
                  {droppedText ? (
                    <div className="flex flex-col gap-3 animate-in fade-in zoom-in duration-300">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles size={12} /> Yakalanan Metin
                      </div>
                      <div className={`p-3 rounded-xl border text-[11px] leading-relaxed italic ${
                        petTheme === 'light' ? 'bg-amber-50/50 border-amber-100 text-slate-600' : 'bg-amber-900/10 border-amber-900/30 text-amber-200/70'
                      }`}>
                        "{droppedText.length > 100 ? droppedText.substring(0, 100) + '...' : droppedText}"
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            addStickyTaskDirectly(droppedText);
                            setDroppedText(null);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold transition-all shadow-sm"
                        >
                          <StickyNote size={12} /> Görev Yap
                        </button>
                        <button
                          onClick={() => {
                            setSearchQuery(droppedText);
                            setIsSearchView(true);
                            setDroppedText(null);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold transition-all shadow-sm"
                        >
                          <Search size={12} /> Mevzuatta Ara
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setDraftSubject(droppedText || '');
                          setIsDraftingView(true);
                          setDroppedText(null);
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-[11px] font-bold transition-all shadow-lg shadow-indigo-100/50"
                      >
                        <PenTool size={14} /> AI ile Taslak Hazırla
                      </button>
                      <button
                        onClick={() => setDroppedText(null)}
                        className={`py-1.5 text-[10px] font-medium border rounded-lg transition-all ${
                          petTheme === 'light' ? 'hover:bg-slate-50 text-slate-400 border-slate-100' : 'hover:bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        Vazgeç
                      </button>
                    </div>
                  ) : isDraftingView ? (
                    renderDraftingView()
                  ) : showStickyForm ? (
                    renderStickyTasksView()
                  ) : isSearchView ? (
                    <div className="flex flex-col gap-2 w-full animate-fade-in pt-0.5">
                      <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                        petTheme === 'light' ? 'text-blue-600 border-slate-100' : 'text-blue-400 border-slate-800'
                      }`}>
                        <Search size={13} className="shrink-0" />
                        <span className="text-[11px]">Mevzuat Hızlı Arama</span>
                        <button 
                          onClick={() => { setIsSearchView(false); setSearchQuery(''); }}
                          className="ml-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
                        >
                          <ArrowLeft size={11} /> Geri
                        </button>
                      </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Aramak istediğiniz konuyu yazın..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full text-xs px-2.5 py-1.5 rounded-lg border outline-none font-medium shadow-sm pr-7 ${
                          petTheme === 'light' 
                            ? 'bg-white text-slate-800 border-slate-200 focus:border-blue-500' 
                            : 'bg-slate-900 text-white border-slate-800 focus:border-blue-500'
                        }`}
                        autoFocus
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    <div className="max-h-36 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                      {(() => {
                        const query = searchQuery.toLowerCase().trim();
                        if (!query) {
                          return (
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hızlı Konular:</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {['İzin', 'Doğum', 'Maaş', 'Sözleşme', '657 DMK', 'İstifa'].map((topic) => (
                                  <button
                                    key={topic}
                                    onClick={() => setSearchQuery(topic)}
                                    className={`text-[10px] font-semibold py-1 px-1.5 border rounded-lg text-left transition-colors truncate ${
                                      petTheme === 'light' 
                                        ? 'border-slate-100 hover:bg-slate-50 text-slate-600' 
                                        : 'border-slate-900 hover:bg-slate-900/40 text-slate-350'
                                    }`}
                                  >
                                    🔍 {topic}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        const filtered = tips.filter(tip => tip.toLowerCase().includes(query));
                        if (filtered.length === 0) {
                          return (
                            <div className="text-[10px] text-slate-400 text-center py-4">
                              Aramanızla eşleşen mevzuat bilgisi bulunamadı.
                            </div>
                          );
                        }

                        return filtered.map((tip, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setBubbleText(tip);
                              setIsSearchView(false);
                              setSearchQuery('');
                              handleInteract('happy', "Aradığın mevzuat bilgisini buldum! İşte detaylar: 📑👇");
                            }}
                            className={`text-[10px] leading-tight font-medium p-2 border rounded-xl text-left transition-all ${
                              petTheme === 'light' 
                                ? 'border-slate-100 hover:bg-slate-50 hover:border-blue-300 text-slate-700 hover:text-blue-800' 
                                : 'border-slate-900 hover:bg-slate-900/50 hover:border-blue-500/50 text-slate-350 hover:text-blue-400'
                            }`}
                          >
                            {tip.length > 80 ? tip.substring(0, 80) + '...' : tip}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                ) : showStepAnalysis ? (
                  <div className="flex flex-col gap-2 w-full animate-fade-in text-xs">
                    <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                      petTheme === 'light' ? 'text-emerald-600 border-slate-100' : 'text-emerald-400 border-slate-800'
                    }`}>
                      <BookOpen size={13} className="shrink-0 text-emerald-500 animate-pulse" />
                      <span className="text-[11px] truncate">Canlı Adım Analizi</span>
                      <button 
                        onClick={() => { setShowStepAnalysis(false); }}
                        className="ml-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
                      >
                        <ArrowLeft size={11} /> Geri
                      </button>
                    </div>

                    {activeStep ? (() => {
                      const analysis = getStructuredAnalysis(activeStep);
                      return (
                        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Adım:</span>
                            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 leading-tight">{analysis.title}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <div className={`p-1.5 border rounded-lg ${petTheme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/30 border-slate-800'}`}>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">Yasal Dayanak</p>
                              <p className="text-[9.5px] font-black text-slate-700 dark:text-slate-200 truncate" title={analysis.lawNo}>{analysis.lawNo}</p>
                            </div>
                            <div className={`p-1.5 border rounded-lg ${petTheme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/30 border-slate-800'}`}>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">Yasal Süre</p>
                              <p className="text-[9.5px] font-black text-slate-700 dark:text-slate-200 truncate" title={analysis.duration}>{analysis.duration}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Kritik İşlem Adımları:</p>
                            <ul className="flex flex-col gap-1 pl-1">
                              {analysis.criticalPoints.map((pt, idx) => (
                                <li key={idx} className="text-[10px] leading-tight font-semibold text-slate-600 dark:text-slate-300 flex items-start gap-1">
                                  <span className="text-emerald-500 shrink-0 font-extrabold">✓</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className={`p-1.5 border rounded-lg flex items-start gap-1.5 ${
                            petTheme === 'light' 
                              ? 'bg-amber-50 border-amber-200/50 text-amber-900' 
                              : 'bg-amber-950/20 border-amber-900/30 text-amber-200'
                          }`}>
                            <ShieldAlert size={12} className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex-1 leading-tight">
                              <span className="text-[8px] font-black uppercase block tracking-wider mb-0.5">KVKK & Güvenlik</span>
                              <span className="text-[9px] font-bold">{analysis.kvkkWarning}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              window.open(`https://www.google.com/search?q=${encodeURIComponent(analysis.lawNo + ' ' + analysis.title + ' mevzuat kararı')}`, '_blank');
                              handleInteract('happy', "Mevzuat araması için tarayıcınızda yeni sekme açtım! 🌐");
                            }}
                            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-[9px] py-1.5 rounded-lg border dark:border-slate-800 transition-colors flex items-center justify-center gap-1 shadow-sm mt-0.5"
                          >
                            Mevzuat Bankasında Ara 🌐
                          </button>
                        </div>
                      );
                    })() : (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <BookOpen size={24} className="text-slate-300 dark:text-slate-700 mb-1.5 animate-bounce" />
                        <p className={`text-[10px] font-semibold leading-normal ${petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Şu anda seçili aktif bir süreç adımı bulunmuyor. Süreç tablosundan bir adıma tıklayarak canlı yasal analizi başlatabilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>
                ) : showRegulatoryFeed ? (
                  <div className="flex flex-col gap-2 w-full animate-fade-in text-xs">
                    <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                      petTheme === 'light' ? 'text-amber-600 border-slate-100' : 'text-amber-400 border-slate-800'
                    }`}>
                      <Newspaper size={13} className="shrink-0 text-amber-500 animate-pulse" />
                      <span className="text-[11px] truncate">Resmi Gazete Takibi</span>
                      <button 
                        onClick={() => { setShowRegulatoryFeed(false); }}
                        className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0"
                      >
                        <ArrowLeft size={10} /> Geri
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Son 48 Saatteki Gelişmeler:</p>
                      {regulatoryFeedItems.map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-2 border rounded-xl flex flex-col gap-1 transition-all ${
                            item.isCritical 
                              ? petTheme === 'light' 
                                ? 'bg-red-50/55 border-red-200 text-slate-850' 
                                : 'bg-red-950/20 border-red-900/40 text-slate-100'
                              : petTheme === 'light' 
                                ? 'bg-slate-50 border-slate-100 text-slate-800' 
                                : 'bg-slate-900/30 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-[8px] font-extrabold text-slate-400">{item.date}</span>
                            <span className={`text-[8px] font-black px-1 rounded-full ${
                              item.isCritical 
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400' 
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>{item.source}</span>
                          </div>
                          <h4 className="text-[10px] font-black leading-tight">{item.title}</h4>
                          <p className="text-[9px] leading-snug font-medium text-slate-500 dark:text-slate-350">{item.summary}</p>
                          <button
                            onClick={() => {
                              window.open(item.link, '_blank');
                              handleInteract('happy', "Sizi resmi kaynağa yönlendiriyorum... 🌐");
                            }}
                            className={`w-full text-center py-1 rounded text-[8.5px] font-bold border transition-colors mt-1 ${
                              petTheme === 'light' 
                                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                            }`}
                          >
                            Resmi Gazete Metni 🔗
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : showWellbeing ? (
                  <div className="flex flex-col gap-2 w-full animate-fade-in text-xs">
                    <div className={`flex items-center gap-1.5 font-bold border-b pb-1.5 ${
                      petTheme === 'light' ? 'text-rose-600 border-slate-100' : 'text-rose-400 border-slate-800'
                    }`}>
                      <Activity size={13} className="shrink-0 text-rose-500 animate-pulse" />
                      <span className="text-[11px] truncate">İSG ve Sağlık Rutini</span>
                      <button 
                        onClick={() => { 
                          setShowWellbeing(false); 
                          setWellbeingActive(false); 
                          setWellbeingStep(0); 
                          setWellbeingStage('menu'); 
                        }}
                        className="ml-auto text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0"
                      >
                        <ArrowLeft size={10} /> Kapat
                      </button>
                    </div>

                    {wellbeingStage === 'menu' ? (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Lütfen Bir Egzersiz Seçin:</p>
                        <button
                          onClick={() => {
                            setWellbeingStage('eye');
                            setWellbeingStep(0);
                            setWellbeingTimer(eyeExerciseSteps[0].duration);
                            setWellbeingActive(true);
                            playBeep(520, 100);
                            setRobotState('happy');
                          }}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            petTheme === 'light' 
                              ? 'border-slate-100 hover:bg-rose-50/50 hover:border-rose-200 text-slate-750' 
                              : 'border-slate-900 hover:bg-rose-950/10 hover:border-rose-900/30 text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-[11px] block">👁️ Masa Başı Göz Egzersizi</span>
                          <span className="text-[9px] text-slate-400 font-medium">Göz kuruluğu ve yorgunluğunu önler (30 sn)</span>
                        </button>

                        <button
                          onClick={() => {
                            setWellbeingStage('stretch');
                            setWellbeingStep(0);
                            setWellbeingTimer(stretchExerciseSteps[0].duration);
                            setWellbeingActive(true);
                            playBeep(520, 100);
                            setRobotState('happy');
                          }}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            petTheme === 'light' 
                              ? 'border-slate-100 hover:bg-rose-50/50 hover:border-rose-200 text-slate-750' 
                              : 'border-slate-900 hover:bg-rose-950/10 hover:border-rose-900/30 text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-[11px] block">🧘‍♂️ Ergonomik Esnetme</span>
                          <span className="text-[9px] text-slate-400 font-medium">Boyun, omuz ve sırt kaslarını gevşetir (28 sn)</span>
                        </button>

                        <button
                          onClick={() => {
                            setWellbeingStage('posture');
                            setWellbeingStep(0);
                            setWellbeingTimer(postureExerciseSteps[0].duration);
                            setWellbeingActive(true);
                            playBeep(520, 100);
                            setRobotState('happy');
                          }}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            petTheme === 'light' 
                              ? 'border-slate-100 hover:bg-rose-50/50 hover:border-rose-200 text-slate-750' 
                              : 'border-slate-900 hover:bg-rose-950/10 hover:border-rose-900/30 text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-[11px] block">📐 Duruş ve Solunum Kontrolü</span>
                          <span className="text-[9px] text-slate-400 font-medium">Doğru oturuş ve beynin oksijenlenmesi (25 sn)</span>
                        </button>
                      </div>
                    ) : (() => {
                      const steps = wellbeingStage === 'eye' 
                        ? eyeExerciseSteps 
                        : wellbeingStage === 'stretch' 
                          ? stretchExerciseSteps 
                          : postureExerciseSteps;
                      const isLast = wellbeingStep === steps.length - 1;
                      
                      return (
                        <div className="flex flex-col gap-2.5 items-center justify-center py-2 text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border font-mono font-bold text-sm ${
                            wellbeingActive ? 'animate-pulse text-rose-500 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'text-slate-400 border-slate-300'
                          }`}>
                            {wellbeingTimer > 0 ? `${wellbeingTimer}s` : "✓"}
                          </div>

                          <div className="flex flex-col gap-1 px-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Adım {wellbeingStep + 1} / {steps.length}</span>
                            <p className="text-[11px] font-extrabold leading-normal">{steps[wellbeingStep].text}</p>
                          </div>

                          {!isLast && (
                            <div className="flex gap-1.5 w-full mt-1">
                              <button
                                onClick={() => {
                                  setWellbeingActive(!wellbeingActive);
                                  playBeep(440, 80);
                                }}
                                className={`flex-1 font-bold text-[9px] py-1.5 rounded-lg border transition-colors ${
                                  wellbeingActive 
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {wellbeingActive ? "Duraklat" : "Devam Et"}
                              </button>
                              <button
                                onClick={() => {
                                  if (wellbeingStep < steps.length - 1) {
                                    const next = wellbeingStep + 1;
                                    setWellbeingStep(next);
                                    setWellbeingTimer(steps[next].duration);
                                    if (next === steps.length - 1) {
                                      setWellbeingActive(false);
                                      setEnergyLevel(prev => Math.min(100, prev + 15));
                                      updateStats('interactions', 1);
                                      setRobotState('happy');
                                    } else {
                                      playBeep(660, 100);
                                    }
                                  }
                                }}
                                className={`flex-1 font-bold text-[9px] py-1.5 rounded-lg border bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800`}
                              >
                                {wellbeingStep === steps.length - 2 ? "Bitir" : "Geç"}
                              </button>
                            </div>
                          )}

                          {isLast && (
                            <button
                              onClick={() => {
                                setWellbeingStage('menu');
                                setWellbeingStep(0);
                                setWellbeingActive(false);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm mt-1"
                            >
                              Ana Menüye Dön
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : currentQuizIndex !== null ? (
                  <div className="flex flex-col gap-2.5 w-full">
                    <div className={`flex flex-col gap-1.5 border-b pb-1.5 ${
                      petTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-bold ${
                        petTheme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      }`}>
                        <Award size={13} className="animate-bounce shrink-0" />
                        <span className={`${getFontClass('title')} truncate`}>Mevzuat Sınavı ({currentQuizIndex + 1})</span>
                        <span className="ml-2 text-[10px] bg-blue-100 px-2 py-0.5 rounded-full text-blue-800 font-black shrink-0">Skor: {quizScore}</span>
                        <button 
                          onClick={() => { 
                            setCurrentQuizIndex(null); 
                            setIsLibraryView(false);
                            handleInteract('happy', "Beyin jimnastiği harikaydı! 😊"); 
                          }}
                          className="ml-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-all"
                        >
                          <ArrowLeft size={11} /> Geri
                        </button>
                      </div>
                      <div className="flex items-center gap-1 justify-between text-[9px] font-bold text-slate-400 mt-0.5">
                        <span>Konu Seçin:</span>
                        <select
                          value={quizCategory}
                          onChange={(e) => handleStartQuiz(e.target.value as any)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border outline-none cursor-pointer ${
                            petTheme === 'light' 
                              ? 'bg-white text-slate-650 border-slate-200' 
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          <option value="Tümü">Tümü ({quizQuestions.length} Soru)</option>
                          <option value="Genel Mevzuat">Genel Mevzuat</option>
                          <option value="İzin Hakları">İzin Hakları</option>
                          <option value="Sözleşmeli Personel">Sözleşmeli Personel</option>
                          <option value="Sağlık Mevzuatı">Sağlık Mevzuatı</option>
                          <option value="Disiplin Mevzuatı">Disiplin Mevzuatı</option>
                          <option value="Mali Haklar">Mali Haklar</option>
                          <option value="Emeklilik İşlemleri">Emeklilik İşlemleri</option>
                        </select>
                      </div>
                    </div>
                    
                    <p className={`${getFontClass('bubble')} font-semibold leading-relaxed pr-1 ${
                      petTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
                    }`}>
                      {quizQuestions[currentQuizIndex].question}
                    </p>

                    {!quizAnswered ? (
                      <div className="flex flex-col gap-1.5 mt-1">
                        {quizQuestions[currentQuizIndex].options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(idx)}
                            className={`w-full text-left px-3 py-2 border rounded-xl transition-all duration-200 text-xs font-semibold flex items-center justify-between ${
                              petTheme === 'light' 
                                ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-800' 
                                : 'border-slate-850 hover:border-blue-500 hover:bg-blue-950/50 text-slate-300 hover:text-blue-400'
                            }`}
                          >
                            <span className="truncate pr-1">{opt}</span>
                            <span className={`text-[10px] font-black border px-1.5 rounded uppercase shrink-0 ${
                              petTheme === 'light' ? 'text-slate-400 border-slate-200 bg-slate-50' : 'text-slate-500 border-slate-800 bg-slate-900'
                            }`}>{String.fromCharCode(65 + idx)}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`flex flex-col gap-2 mt-1 p-2.5 rounded-xl border animate-fade-in ${
                        petTheme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/40 border-slate-800'
                      }`}>
                        <div className="flex items-center gap-1">
                          {selectedAnswerIndex === quizQuestions[currentQuizIndex].correctIndex ? (
                            <span className="text-emerald-600 font-extrabold flex items-center gap-1 text-xs">🎉 Doğru! (+10 Enerji)</span>
                          ) : (
                            <span className="text-rose-600 font-extrabold text-xs">❌ Yanlış! Doğru Cevap: {String.fromCharCode(65 + quizQuestions[currentQuizIndex].correctIndex)}</span>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed italic ${
                          petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {quizQuestions[currentQuizIndex].explanation}
                        </p>
                        <div className="flex gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={handleStartQuiz}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
                          >
                            Sıradaki Soru ➡️
                          </button>
                          <button
                            type="button"
                            onClick={() => { 
                              setCurrentQuizIndex(null); 
                              setIsLibraryView(false);
                              handleInteract('happy', "Sınavı başarıyla bitirdin! Harika bir beyin jimnastiğiydi. 😊"); 
                            }}
                            className={`font-bold text-xs py-1.5 px-3 rounded-xl transition-colors ${
                              petTheme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-705' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            Kapat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Status/Levels Bar in normal bubble view */}
                    <div className={`flex items-center justify-between gap-2 text-[10px] font-bold border-b pb-2 mb-1.5 py-1.5 px-2 rounded-xl ${
                      petTheme === 'light' 
                        ? 'text-slate-400 border-slate-100 bg-amber-50/25' 
                        : 'text-slate-500 border-slate-800 bg-amber-950/10'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-extrabold shrink-0 ${
                        petTheme === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}>
                        <span>💬 {petName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={11} className="text-amber-500 fill-amber-500 animate-bounce" />
                        <div className={`w-24 h-1.5 rounded-full overflow-hidden ${
                          petTheme === 'light' ? 'bg-slate-200' : 'bg-slate-800'
                        }`}>
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${energyLevel}%` }} />
                        </div>
                        <span className="text-[10px] text-amber-600">{energyLevel}%</span>
                      </div>
                    </div>

                    {isFocusing && (
                      <div className={`mb-2 px-2 py-1.5 border rounded-lg flex items-center justify-between animate-pulse ${
                        petTheme === 'light' 
                          ? 'bg-blue-50 border-blue-100 text-blue-700' 
                          : 'bg-blue-950/30 border-blue-900/40 text-blue-350'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-[10px] font-bold">ODAKLANMA SEANSI</span>
                        </div>
                        <span className="text-xs font-mono font-bold">{formatTime(focusTimeLeft)}</span>
                      </div>
                    )}

                    <p className={`${getFontClass('bubble')} font-semibold leading-relaxed whitespace-pre-line ${
                      petTheme === 'light' ? 'text-slate-800' : 'text-slate-100'
                    }`}>
                      {bubbleText}
                    </p>

                    {/* İSM Daily Report Status Panel */}
                    <div className={`border-t border-b py-2.5 my-0.5 ${
                      petTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
                    }`}>
                      {ismStatus === 'pending' ? (
                        <div className={`border rounded-xl p-3 flex flex-col gap-2 ${
                          petTheme === 'light' 
                            ? 'bg-amber-50 border-amber-200 text-amber-900' 
                            : 'bg-amber-950/30 border-amber-900/30 text-amber-100'
                        }`}>
                          <div className="flex items-start gap-2">
                            <ShieldAlert size={15} className="text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                            <div className="flex-1">
                              <p className={`text-[10px] font-bold uppercase tracking-wider ${petTheme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>Günlük İSM Görevi</p>
                              <p className={`text-[10px] leading-tight ${petTheme === 'light' ? 'text-amber-700' : 'text-amber-200'}`}>Günlük Personel Hareket Listesi'ni İl Sağlık Müdürlüğü'ne (İSM) göndermeyi unutmayın!</p>
                            </div>
                          </div>
                          <button
                            onClick={markIsmAsSent}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Check size={12} /> İSM'ye Gönderildi Olarak İşaretle
                          </button>
                        </div>
                      ) : (
                        <div className={`border rounded-xl p-2.5 flex items-center gap-2 ${
                          petTheme === 'light' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-emerald-950/30 border-emerald-900/30 text-emerald-100'
                        }`}>
                          <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                          <div className="flex-1">
                            <p className={`text-[10px] font-bold uppercase tracking-wide ${petTheme === 'light' ? 'text-emerald-800' : 'text-emerald-300'}`}>İSM Görevi Tamamlandı</p>
                            <p className={`text-[9px] ${petTheme === 'light' ? 'text-emerald-700' : 'text-emerald-200'}`}>Bugünkü Personel Hareket Listesi başarıyla iletildi.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setIsAssistantOpen(true);
                          handleInteract('happy', "Yapay zekâ asistanımızı açtım! Sağ panelden detaylı sorularını sorabilirsin. 💬");
                        }}
                        className={`border rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                          petTheme === 'light' 
                            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100/60' 
                            : 'bg-blue-950/40 border-blue-900/40 text-blue-350 hover:bg-blue-900/40'
                        }`}
                      >
                        <MessageSquare size={11} /> Sohbet Başlat
                      </button>
                      <button
                        onClick={() => {
                          openNewTemplateModal();
                          handleInteract('happy', "Harika! Yeni bir süreç tasarlama modülünü açtım. Kolay gelsin!");
                        }}
                        className={`border rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                          petTheme === 'light' 
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <Plus size={11} /> Süreç Tasarla
                      </button>
                      <button
                        onClick={showNextTip}
                        className={`border rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                          petTheme === 'light' 
                            ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100/60' 
                            : 'bg-orange-950/40 border-orange-900/40 text-orange-350 hover:bg-orange-900/40'
                        }`}
                      >
                        <HelpCircle size={11} /> Bilgi Kartı
                      </button>
                      <button
                        onClick={() => {
                          handleInteract('happy', "Süreçler tıkır tıkır işliyor! Kahveni yudumlarken sakin kalmayı unutma. ☕");
                        }}
                        className={`border rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                          petTheme === 'light' 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/60' 
                            : 'bg-indigo-950/40 border-indigo-900/40 text-indigo-350 hover:bg-indigo-900/40'
                        }`}
                      >
                        <Coffee size={11} /> Kahve Molası
                      </button>
                    </div>

                    <div className={`flex justify-between items-center text-[9px] border-t pt-2 mt-1 ${
                      petTheme === 'light' ? 'text-slate-400 border-slate-100' : 'text-slate-500 border-slate-850'
                    }`}>
                      <span>🤖 Sürükleyip taşıyabilirsiniz</span>
                      <button 
                        onClick={() => setIsVisible(false)}
                        className={`${petTheme === 'light' ? 'text-slate-450 hover:text-red-500' : 'text-slate-500 hover:text-red-400'} font-medium transition-colors`}
                      >
                        Robotu Gizle
                      </button>
                    </div>
                  </>
                )}
                  </div>
                </div>

                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-b border-r rotate-45 ${
                  petTheme === 'light' ? 'bg-white border-slate-100' : 'bg-slate-950 border-slate-800'
                }`}></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Mascot */}
          <div 
            className="flex flex-col items-center"
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                handleInteract('happy', "Merhaba! Geldim, ne yapıyoruz? 😊");
              } else {
                handleInteract('happy', "Dokunulmak hoşuma gidiyor! Sana mevzuat ve süreç takibinde her zaman yardıma hazırım. ✨");
              }
            }}
          >
            {isMinimized ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg relative border border-blue-400"
              >
                <Sparkles size={16} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
              </motion.div>
            ) : (
              <div className="relative">
                {/* Floating Container */}
                <motion.div
                  animate={getMascotAnimation()}
                  transition={getMascotTransition()}
                  className="w-16 h-16 relative"
                >
                  <JoyParticles active={robotState === 'happy' && energyLevel > 80} />
                  {/* Floating Mood Effects */}
                  <AnimatePresence>
                    {floatingEffects.map(effect => (
                      <motion.div
                        key={effect.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -60, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        className="absolute pointer-events-none text-sm z-20"
                        style={{ left: `calc(50% + ${effect.x}px)`, top: '20%' }}
                      >
                        {effect.icon}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Robot Body SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    {/* Glowing Aura */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '20s' }} />
                    
                    {/* Antenna */}
                    <line x1="50" y1="20" x2="50" y2="12" stroke={robotColors.border} strokeWidth="4" strokeLinecap="round" />
                    <motion.circle 
                      cx="50" 
                      cy="12" 
                      r="5" 
                      fill={robotState === 'thinking' ? '#f97316' : robotColors.border} 
                      animate={robotState === 'thinking' ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />

                    {/* Head Outline */}
                    <rect x="22" y="20" width="56" height="52" rx="18" fill={robotColors.body} stroke={robotColors.border} strokeWidth="4" />
                    
                    {/* Face Screen */}
                    <rect x="28" y="26" width="44" height="34" rx="10" fill="#1e293b" />

                    {/* Eyes rendering depending on emotional state */}
                    {energyLevel < 35 ? (
                      <>
                        {/* Sleepy droopy eyes */}
                        <ellipse cx="39" cy="45" rx="5" ry="2.5" fill="#60a5fa" />
                        <ellipse cx="61" cy="45" rx="5" ry="2.5" fill="#60a5fa" />
                        <path d="M 33 40 Q 39 42 45 40" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 55 40 Q 61 42 67 40" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                      </>
                    ) : robotState === 'surprised' ? (
                      <>
                        <circle cx="39" cy="43" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="61" cy="43" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="39" cy="43" r="2" fill="#000" />
                        <circle cx="61" cy="43" r="2" fill="#000" />
                      </>
                    ) : robotState === 'happy' ? (
                      <>
                        <path d="M 34 45 Q 39 37 44 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 56 45 Q 61 37 66 45" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                      </>
                    ) : robotState === 'thinking' ? (
                      <>
                        <text x="33" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                        <text x="55" y="48" fill="#fbbf24" fontSize="16" fontWeight="bold">?</text>
                      </>
                    ) : robotState === 'waving' ? (
                      <>
                        <circle cx="39" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="61" cy="43" r="5" fill="#38bdf8" />
                        <circle cx="33" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                        <circle cx="67" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                      </>
                    ) : (
                      <>
                        <motion.ellipse 
                          cx="39" 
                          cy="43" 
                          rx="5" 
                          ry="5" 
                          fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                        <motion.ellipse 
                          cx="61" 
                          cy="43" 
                          rx="5" 
                          ry="5" 
                          fill="#60a5fa" 
                          animate={{ ry: [5, 0.5, 5] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        />
                      </>
                    )}

                    {/* Mouth LED */}
                    <motion.path 
                      d="M 42 54 L 58 54" 
                      stroke="#38bdf8" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      animate={robotState === 'waving' ? { d: "M 44 53 Q 50 58 56 53" } : {}}
                    />

                    {/* Side ears/bolts */}
                    <rect x="16" y="38" width="6" height="16" rx="2" fill="#94a3b8" />
                    <rect x="78" y="38" width="6" height="16" rx="2" fill="#94a3b8" />

                    {/* Costumes */}
                    {costume === 'expert' && (
                      <>
                        <polygon points="32,16 50,8 68,16 50,24" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
                        <rect x="48" y="16" width="4" height="6" fill="#1e1b4b" />
                        <line x1="68" y1="16" x2="72" y2="25" stroke="#eab308" strokeWidth="1" />
                        <circle cx="72" cy="25" r="2" fill="#eab308" />
                      </>
                    )}
                    {costume === 'stethoscope' && (
                      <>
                        <path d="M 28,68 Q 50,88 72,68" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 50,78 L 50,86" fill="none" stroke="#e11d48" strokeWidth="2.5" />
                        <circle cx="50" cy="88" r="4" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
                      </>
                    )}
                    {costume === 'glasses' && (
                      <>
                        <circle cx="39" cy="43" r="10" fill="none" stroke="#eab308" strokeWidth="2.5" />
                        <circle cx="61" cy="43" r="10" fill="none" stroke="#eab308" strokeWidth="2.5" />
                        <line x1="49" y1="43" x2="51" y2="43" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Temple pieces */}
                        <line x1="29" y1="43" x2="22" y2="40" stroke="#eab308" strokeWidth="2" />
                        <line x1="71" y1="43" x2="78" y2="40" stroke="#eab308" strokeWidth="2" />
                      </>
                    )}

                    {/* Carried Task Visuals */}
                    {stickyTasks.some(t => !t.completed && t.carryType === 'mouth_envelope') && (
                      <g transform="translate(42, 58)">
                        <rect x="0" y="0" width="16" height="10" rx="1.5" fill="#fef9c3" stroke="#eab308" strokeWidth="1" />
                        <path d="M 0 0 L 8 5 L 16 0" fill="none" stroke="#eab308" strokeWidth="1" />
                      </g>
                    )}
                    {stickyTasks.some(t => !t.completed && t.carryType === 'head_postit') && (
                      <g transform="translate(62, 10)">
                        <rect x="0" y="0" width="12" height="12" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                        <line x1="2" y1="3" x2="10" y2="3" stroke="#d97706" strokeWidth="0.8" />
                        <line x1="2" y1="6" x2="10" y2="6" stroke="#d97706" strokeWidth="0.8" />
                      </g>
                    )}
                  </svg>

                  {/* Little waving arm */}
                  {robotState === 'waving' && (
                    <motion.div 
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [-20, 20, -20] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute -right-2 top-8 w-6 h-3 bg-blue-500 rounded-full origin-left border border-blue-600"
                      style={{ transformOrigin: '0% 50%' }}
                    />
                  )}
                </motion.div>
                
                {/* Floating shadow */}
                <div className="w-10 h-1 bg-slate-300/40 rounded-full mx-auto blur-[1px] animate-pulse mt-1"></div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right Click Custom Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`fixed z-50 backdrop-blur-md rounded-2xl shadow-2xl border w-64 text-xs font-medium pointer-events-auto select-none overflow-hidden flex flex-col transition-all duration-300 ${
              petTheme === 'light' 
                ? 'bg-white/95 border-slate-100 text-slate-800 shadow-slate-200/50' 
                : 'bg-slate-950/95 border-slate-800 text-white shadow-black/85'
            }`}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => e.stopPropagation()} // Stop propagation so it doesn't trigger drag
          >
            {/* Scrollable Container */}
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar py-2.5">
              <div className={`px-3.5 py-1.5 border-b text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 sticky top-0 z-20 ${
                petTheme === 'light' 
                  ? 'bg-white/95 border-slate-100 text-slate-400' 
                  : 'bg-slate-950/95 border-slate-800 text-slate-400'
              }`}>
                <Settings size={12} className="text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Asistan Seçenekleri</span>
              </div>
              
              {/* Stats View inside Light/Dark Menu */}
              <div className={`grid grid-cols-3 gap-1 mx-3.5 my-2 p-2 rounded-xl border ${
                petTheme === 'light' 
                  ? 'bg-slate-50 border-slate-100 text-slate-800' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-300'
              }`}>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Odak</span>
                  <span className={`text-[11px] font-bold ${petTheme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{stats.focusMinutes}dk</span>
                </div>
                <div className={`flex flex-col items-center border-x ${petTheme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Quiz</span>
                  <span className={`text-[11px] font-bold ${petTheme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>{stats.quizzesSolved}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">İlgi</span>
                  <span className={`text-[11px] font-bold ${petTheme === 'light' ? 'text-rose-600' : 'text-rose-400'}`}>{stats.interactions}</span>
                </div>
              </div>

              {/* Weather Info in Light/Dark Menu */}
              {weather && (
                <div className={`mx-3.5 mb-2 p-2 rounded-xl border flex items-center justify-between ${
                  petTheme === 'light' 
                    ? 'bg-blue-50/50 border-blue-100 text-blue-700' 
                    : 'bg-blue-900/20 border-blue-800/30 text-blue-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Cloud size={14} className={petTheme === 'light' ? 'text-blue-500 animate-pulse' : 'text-blue-400'} />
                    <span className="text-[10px] font-bold uppercase">Hava Durumu</span>
                  </div>
                  <span className="text-[11px] font-bold">{weather.temp}°C</span>
                </div>
              )}
            
            {/* Inline Name Editor for Main View */}
            <div className={`px-3.5 py-2 flex flex-col gap-1 text-[10px] border-b ${
              petTheme === 'light' ? 'border-slate-50 bg-slate-50/50' : 'border-slate-850 bg-slate-900/20'
            }`}>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🏷️ Asistan İsmi</span>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Asistan ismi..."
                  className={`text-[10.5px] px-2 py-1 rounded border flex-1 outline-none font-bold shadow-sm ${
                    petTheme === 'light' 
                      ? 'bg-white text-slate-800 border-slate-200 focus:border-blue-500' 
                      : 'bg-slate-900 text-white border-slate-800 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* TTS Toggle */}
            {/* User Memory Section */}
            <div className={`px-3.5 py-3 flex flex-col gap-2 border-b ${
              petTheme === 'light' ? 'border-slate-50 bg-white' : 'border-slate-850 bg-slate-900/40'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Heart size={13} className="text-pink-500" />
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Kişisel Hafıza (Beni Tanı)</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-medium ml-1">Senin İsmin</span>
                  <input
                    type="text"
                    value={userMemory.userName}
                    onChange={(e) => setUserMemory({...userMemory, userName: e.target.value})}
                    placeholder="İsmini buraya yaz..."
                    className={`text-[10px] px-2 py-1.5 rounded border outline-none font-medium ${
                      petTheme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-pink-300' : 'bg-slate-800 border-slate-700 focus:border-pink-500 text-white'
                    }`}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-medium ml-1">Favori Aktivitelerin</span>
                  <input
                    type="text"
                    value={userMemory.favoriteActivities}
                    onChange={(e) => setUserMemory({...userMemory, favoriteActivities: e.target.value})}
                    placeholder="Kod yazmak, kahve içmek vb."
                    className={`text-[10px] px-2 py-1.5 rounded border outline-none font-medium ${
                      petTheme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-pink-300' : 'bg-slate-800 border-slate-700 focus:border-pink-500 text-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-medium ml-1">Ana Hedeflerin</span>
                  <input
                    type="text"
                    value={userMemory.goals}
                    onChange={(e) => setUserMemory({...userMemory, goals: e.target.value})}
                    placeholder="Bu hafta projeyi bitir..."
                    className={`text-[10px] px-2 py-1.5 rounded border outline-none font-medium ${
                      petTheme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-pink-300' : 'bg-slate-800 border-slate-700 focus:border-pink-500 text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setTtsEnabled(!ttsEnabled);
                if (!ttsEnabled) {
                  setTimeout(() => speak("Sesli bildirimler etkinleştirildi!"), 200);
                }
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 border-b ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 border-slate-50' : 'hover:bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <div className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${ttsEnabled ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                {ttsEnabled ? <Mic size={14} className="animate-pulse" /> : <MicOff size={14} />}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px]">Sesli Yanıt (TTS)</span>
                  <div className={`w-6 h-3 rounded-full relative transition-colors ${ttsEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${ttsEnabled ? 'left-3.5' : 'left-0.5'}`} />
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5">{ttsEnabled ? "Robot önemli olayları seslendirir" : "Sadece metin balonları gösterilir"}</span>
              </div>
            </button>

            <button
              onClick={() => {
                setIsAssistantOpen(true);
                handleInteract('happy', "Yapay zekâ asistanımızı açtım! Sağ panelden detaylı sorularını sorabilirsin. 💬");
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <MessageSquare size={14} className="text-blue-500" />
              <span>Sohbet Asistanını Aç</span>
            </button>

            <button
              onClick={() => {
                setIsDraftingView(true);
                setIsVisible(true);
                setShowBubble(true);
                setContextMenu(null);
                handleInteract('happy', "Yazım asistanını hazırladım! Nasıl bir metin hazırlamamı istersin? ✍️✨");
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-indigo-600' : 'hover:bg-slate-900 text-slate-300 hover:text-indigo-400'
              }`}
            >
              <PenTool size={14} className="text-indigo-500" />
              <span>AI Yazım Asistanı (Dilekçe/Yazı) ✍️</span>
            </button>

            <button
              onClick={() => {
                openNewTemplateModal();
                handleInteract('happy', "Harika! Yeni bir süreç tasarlama modülünü açtım. Kolay gelsin!");
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <Plus size={14} className="text-emerald-500" />
              <span>Yeni Süreç / Şablon Tasarla</span>
            </button>

             <button
              onClick={() => {
                setIsSearchView(true);
                setIsVisible(true);
                setShowBubble(true);
                setShowStepAnalysis(false);
                setContextMenu(null);
                playBeep(520, 100);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <Search size={14} className="text-blue-500" />
              <span>Mevzuat Hızlı Arama 🔍</span>
            </button>

            <button
              onClick={() => {
                setShowStepAnalysis(true);
                setIsVisible(true);
                setShowBubble(true);
                setIsSearchView(false);
                setContextMenu(null);
                playBeep(520, 100);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <BookOpen size={14} className="text-emerald-500" />
              <span>Canlı Adım Analizi 📋</span>
            </button>

            <button
              onClick={() => {
                setShowRegulatoryFeed(true);
                setIsVisible(true);
                setShowBubble(true);
                setIsSearchView(false);
                setShowStepAnalysis(false);
                setShowWellbeing(false);
                setCurrentQuizIndex(null);
                setContextMenu(null);
                playBeep(520, 100);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' 
                  ? 'hover:bg-amber-50 text-amber-700' 
                  : 'hover:bg-amber-950 text-amber-400'
              }`}
            >
              <Newspaper size={14} className="text-amber-500" />
              <span>Resmi Gazete Takibi 📰</span>
            </button>

            <button
              onClick={() => {
                setShowWellbeing(true);
                setIsVisible(true);
                setShowBubble(true);
                setIsSearchView(false);
                setShowStepAnalysis(false);
                setShowRegulatoryFeed(false);
                setCurrentQuizIndex(null);
                setContextMenu(null);
                setWellbeingStage('menu');
                playBeep(520, 100);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' 
                  ? 'hover:bg-rose-50 text-rose-700' 
                  : 'hover:bg-rose-950 text-rose-400'
              }`}
            >
              <Activity size={14} className="text-rose-500" />
              <span>İSG ve Sağlık Rutini ⏱️</span>
            </button>

            <button
              onClick={() => {
                triggerProactiveNudge();
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' 
                  ? 'hover:bg-indigo-50 text-indigo-700' 
                  : 'hover:bg-indigo-950 text-indigo-400'
              }`}
            >
              <Sparkles size={14} className="text-indigo-500 animate-pulse" />
              <span>Akıllı Dürtme Simüle Et 💡</span>
            </button>

            <button
              onClick={() => {
                showNextTip();
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <HelpCircle size={14} className="text-amber-500" />
              <span>Faydalı Mevzuat İpucu Ver</span>
            </button>

            <button
              onClick={() => {
                resetIsmStatus();
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <ShieldAlert size={14} className="text-red-500 animate-pulse" />
              <span>Günlük İSM Görevi Sıfırla</span>
            </button>

            <div className={`h-px my-1 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

            {/* Mascot Mood selection */}
            <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Maskot Duygu Durumu
            </div>
            <div className="grid grid-cols-4 gap-1 px-3 py-1">
              {(['idle', 'happy', 'thinking', 'waving'] as RobotState[]).map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    const textMap: Record<RobotState, string> = {
                      idle: "Normal modda bekliyorum. Yapılacak işleri gözlemliyorum. 🧐",
                      happy: "Harika hissediyorum! Bugün çok verimli bir gün olacak! 🎉",
                      thinking: "Mevzuatı inceliyorum, verileri analiz ediyorum... 🧠",
                      waving: "Sana el sallıyorum! Kolay gelsin mesai arkadaşım! 👋",
                      sleepy: "Esniyorum... Biraz dinlensem fena olmazdı. 💤",
                      surprised: "Ooo! Bu neymiş böyle? Çok şaşırdım! 😮"
                    };
                    handleInteract(state, textMap[state]);
                    setContextMenu(null);
                  }}
                  className={`text-[9px] font-bold py-1 rounded-md transition-all ${
                    robotState === state 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : petTheme === 'light' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {state === 'idle' ? 'Sakin' : state === 'happy' ? 'Mutlu' : state === 'thinking' ? 'Düşün' : 'Selam'}
                </button>
              ))}
            </div>

            <div className={`h-px my-1 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

            {/* Quiz Game Trigger */}
            <button
              onClick={() => {
                handleStartQuiz();
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 font-bold ${
                petTheme === 'light' ? 'hover:bg-amber-50 text-amber-950 hover:text-amber-800' : 'hover:bg-amber-955/15 text-amber-300 hover:text-amber-200'
              }`}
            >
              <Award size={14} className="text-amber-500 animate-bounce" />
              <span>Mevzuat Bilgi Sınavı 🏆</span>
            </button>

            <button
              onClick={() => {
                setShowStickyForm(true);
                setIsVisible(true);
                setShowBubble(true);
                setIsSearchView(false);
                setShowStepAnalysis(false);
                setShowRegulatoryFeed(false);
                setShowWellbeing(false);
                setCurrentQuizIndex(null);
                setContextMenu(null);
                playBeep(520, 100);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 font-bold ${
                petTheme === 'light' ? 'hover:bg-indigo-50 text-indigo-950 hover:text-indigo-800' : 'hover:bg-indigo-950/15 text-indigo-300 hover:text-indigo-200'
              }`}
            >
              <StickyNote size={14} className="text-indigo-500 animate-pulse" />
              <span>Görev Yapışkanı Teslim Et 📝</span>
            </button>

            <div className={`h-px my-1 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

            {/* Custom Interactive Selectors inside Context Menu */}
            <div className="px-3.5 py-1.5 flex flex-col gap-1 text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🎭 Kostüm Değiştir</span>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'classic', label: 'Mavi' },
                  { id: 'expert', label: 'Uzman' },
                  { id: 'stethoscope', label: 'Hekim' },
                  { id: 'glasses', label: 'Tarz' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setCostume(item.id as any); playBeep(520, 80); }}
                    className={`px-1 py-1 rounded text-center text-[9px] font-bold border transition-all ${
                      costume === item.id 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                        : petTheme === 'light' 
                          ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3.5 py-1.5 flex flex-col gap-1 text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🔍 Metin Boyutu</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'large', label: 'Büyük' },
                  { id: 'xlarge', label: 'X-Büyük' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setFontSizeMode(item.id as any); playBeep(520, 80); }}
                    className={`px-1 py-1 rounded text-center text-[9px] font-bold border transition-all ${
                      fontSizeMode === item.id 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm' 
                        : petTheme === 'light' 
                          ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3.5 py-1.5 flex flex-col gap-1 text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🎶 Ses Efekti Teması</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'retro', label: 'Retro 👾' },
                  { id: 'modern', label: 'Modern ✨' },
                  { id: 'futuristic', label: 'Fütüristik 🚀' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setSoundTheme(item.id as any); setTimeout(() => playBeep(520, 100), 50); }}
                    className={`px-1 py-1 rounded text-center text-[9px] font-bold border transition-all ${
                      soundTheme === item.id 
                        ? 'bg-sky-600 text-white border-sky-500 shadow-sm' 
                        : petTheme === 'light' 
                          ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

                {/* Stats Section in Main UI */}
                <div className={`px-3.5 py-1.5 flex flex-col gap-1 text-[10px] border-y ${
                  petTheme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-slate-900/20 border-slate-800'
                }`}>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Award size={12} className="text-amber-500" /> Başarıların
                  </span>
                  <div className="grid grid-cols-3 gap-2 py-1">
                    <div className="flex flex-col">
                      <span className={`text-[16px] font-mono font-bold leading-none ${petTheme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{stats.focusMinutes}</span>
                      <span className="text-[8px] text-slate-500 uppercase mt-0.5">Odak dk</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[16px] font-mono font-bold leading-none ${petTheme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{stats.quizzesSolved}</span>
                      <span className="text-[8px] text-slate-500 uppercase mt-0.5">Soru</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[16px] font-mono font-bold leading-none ${petTheme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{stats.interactions}</span>
                      <span className="text-[8px] text-slate-500 uppercase mt-0.5">İlgi</span>
                    </div>
                  </div>
                </div>

                {/* Focus Mode Section in Main UI */}
            <div className="px-3.5 py-1.5 flex flex-col gap-1 text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🎯 Odaklanma Yardımı</span>
              <div className="flex gap-1">
                {!isFocusing ? (
                  <button
                    onClick={() => startFocusSession(25)}
                    className={`flex-1 px-2 py-2 border rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      petTheme === 'light' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' 
                        : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30'
                    }`}
                  >
                    <Zap size={12} /> 25 Dakika Odaklan
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsFocusing(false); setFocusTimeLeft(0); }}
                    className={`flex-1 px-2 py-2 border rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      petTheme === 'light' 
                        ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                        : 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30'
                    }`}
                  >
                    <X size={12} /> Odaklanmayı Durdur ({formatTime(focusTimeLeft)})
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 mt-1 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={breakRemindersEnabled} 
                  onChange={(e) => {
                    setBreakRemindersEnabled(e.target.checked);
                    localStorage.setItem('pet_break_reminders', e.target.checked.toString());
                  }}
                  className={`w-3.5 h-3.5 rounded focus:ring-blue-500 ${
                    petTheme === 'light' ? 'border-slate-300 text-blue-600' : 'border-slate-700 bg-slate-900 text-blue-600'
                  }`}
                />
                <span className={`text-[10px] font-bold group-hover:text-slate-700 transition-colors ${
                  petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>Mola Hatırlatıcılarını Aktif Et</span>
              </label>
            </div>

             <div className={`px-3.5 py-1.5 flex flex-col gap-2.5 text-[10px] border-t ${
               petTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
             }`}>
               <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🖥️ Sistem ve Pencere Ayarları</span>
               <label className="flex items-center gap-2 cursor-pointer group">
                 <input 
                   type="checkbox" 
                   checked={minimizeOnClose} 
                   onChange={(e) => setMinimizeOnClose(e.target.checked)}
                   className={`w-3.5 h-3.5 rounded focus:ring-blue-500 ${
                     petTheme === 'light' ? 'border-slate-300 text-blue-600' : 'border-slate-700 bg-slate-900 text-blue-600'
                   }`}
                 />
                 <span className={`text-[10px] font-bold group-hover:text-slate-750 transition-colors ${
                   petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                 }`}>Çarpıya Basınca Tepsiye Küçült</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer group">
                 <input 
                   type="checkbox" 
                   checked={isRoaming} 
                   onChange={(e) => {
                     setIsRoaming(e.target.checked);
                     if (e.target.checked) {
                       handleInteract('happy', "Süper! Masaüstünde gezinmeye başlıyorum! 🚶‍♂️✨");
                     } else {
                       handleInteract('idle', "Yürüyüşü durdurdum, sakince bekliyorum. 🛋️");
                     }
                   }}
                   className={`w-3.5 h-3.5 rounded focus:ring-blue-500 ${
                     petTheme === 'light' ? 'border-slate-300 text-blue-600' : 'border-slate-700 bg-slate-900 text-blue-600'
                   }`}
                 />
                 <span className={`text-[10px] font-bold group-hover:text-slate-750 transition-colors ${
                   petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                 }`}>Otonom Gezinme (Ekran Yürüyüşü)</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer group">
                 <input 
                   type="checkbox" 
                   checked={teleportEnabled} 
                   onChange={(e) => {
                     setTeleportEnabled(e.target.checked);
                     if (e.target.checked) {
                       handleInteract('happy', "Harika! Rastgele aralıklarla ışınlanacağım! 🚀✨");
                     } else {
                       handleInteract('idle', "Zıplamayı durdurdum, sabit duruyorum. ⚓");
                     }
                   }}
                   className={`w-3.5 h-3.5 rounded focus:ring-blue-500 ${
                     petTheme === 'light' ? 'border-slate-300 text-blue-600' : 'border-slate-700 bg-slate-900 text-blue-600'
                   }`}
                 />
                 <span className={`text-[10px] font-bold group-hover:text-slate-750 transition-colors ${
                   petTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                 }`}>Rastgele Işınlanma Modu 🔮</span>
               </label>
             </div>

             <div className="px-3.5 py-1.5 flex flex-col gap-1 text-[10px]">
               <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">🔋 Pet Bakımı (Besleme & Sevme)</span>
               <div className="grid grid-cols-2 gap-1 mb-1">
                 <button
                   type="button"
                   onClick={() => handlePetAction('stroke')}
                   className={`px-1 py-1.5 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                     petTheme === 'light' 
                       ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700' 
                       : 'bg-rose-955/20 border border-rose-900/35 hover:bg-rose-900/40 text-rose-300'
                   }`}
                 >
                   <span>Okşa 👋</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => handlePetAction('clean')}
                   className={`px-1 py-1.5 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                     petTheme === 'light' 
                       ? 'bg-sky-50 border-sky-200 hover:bg-sky-100 text-sky-700' 
                       : 'bg-sky-955/20 border border-sky-900/35 hover:bg-sky-900/40 text-sky-300'
                   }`}
                 >
                   <span>Temizle ✨</span>
                 </button>
               </div>
               <div className="grid grid-cols-2 gap-1">
                 <button
                   type="button"
                   onClick={() => handlePetAction('feed_doc')}
                   className={`px-1 py-1.5 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                     petTheme === 'light' 
                       ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700' 
                       : 'bg-emerald-955/15 border border-emerald-900/35 hover:bg-emerald-900/40 text-emerald-300'
                   }`}
                 >
                   <span>Genelge 📑</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => handlePetAction('give_coffee')}
                   className={`px-1 py-1.5 border rounded text-center text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                     petTheme === 'light' 
                       ? 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700' 
                       : 'bg-amber-955/20 border border-amber-900/35 hover:bg-amber-900/40 text-amber-300'
                   }`}
                 >
                   <span>Kahve ☕</span>
                 </button>
               </div>
             </div>

            <div className={`h-px my-1 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

            <button
              onClick={() => {
                const updatedSound = !soundEnabled;
                setSoundEnabled(updatedSound);
                // We set soundEnabled temporarily in this local tick to trigger playBeep immediately
                if (updatedSound) {
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(700, ctx.currentTime);
                    gain.gain.setValueAtTime(0.05, ctx.currentTime);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.1);
                  } catch(e) {}
                }
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={14} className="text-blue-500" /> : <VolumeX size={14} className="text-slate-400" />}
                <span>Asistan Sesleri</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {soundEnabled ? 'Açık' : 'Kapalı'}
              </span>
            </button>

            <button
              onClick={() => {
                setIsMinimized(!isMinimized);
                setContextMenu(null);
                playBeep(400, 80);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              {isMinimized ? <Maximize2 size={14} className="text-slate-500" /> : <Minimize2 size={14} className="text-slate-500" />}
              <span>{isMinimized ? "Asistanı Büyüt" : "Asistanı Simge Durumuna Getir"}</span>
            </button>

            <button
              onClick={() => {
                setIsVisible(false);
                setContextMenu(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center gap-2 ${
                petTheme === 'light' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-955/35 text-red-400'
              }`}
            >
              <EyeOff size={14} />
              <span>Asistanı Gizle (Kapat)</span>
            </button>

            <div className={`h-px my-1 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

            {/* Dynamic Theme Changer Button */}
            <button
              onClick={() => {
                const newTheme = petTheme === 'light' ? 'dark' : 'light';
                setPetTheme(newTheme);
                playBeep(520, 80);
              }}
              className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between ${
                petTheme === 'light' ? 'hover:bg-slate-50 text-slate-700 hover:text-blue-600' : 'hover:bg-slate-900 text-slate-300 hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                <span>Asistan Teması</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                petTheme === 'light' ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {petTheme === 'light' ? 'Açık ☀️' : 'Koyu 🌙'}
              </span>
            </button>

            <div className={`h-px my-1 ${petTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>
            
            <div className={`px-3.5 py-1.5 flex flex-col gap-1 text-[10px] text-center italic ${
              petTheme === 'light' ? 'text-slate-400 bg-slate-50/30' : 'text-slate-500 bg-slate-900/10'
            }`}>
              {currentHour >= 22 || currentHour < 6 ? "🌙 Gece Modu: Pet biraz uykulu..." : "☀️ Gündüz Modu: Pet enerjik!"}
            </div>
          </div>
      </motion.div>
    )}
  </AnimatePresence>
    </>
  );
}
