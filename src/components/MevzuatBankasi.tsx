import React, { useState, useMemo } from 'react';
import { 
  Scale, Search, BookOpen, FileText, HelpCircle, ExternalLink, 
  Filter, BookMarked, Briefcase, Calendar, ShieldAlert, CheckCircle,
  Clock, AlertTriangle, ArrowUpRight, Copy, Check, ChevronDown, ChevronUp, X
} from 'lucide-react';

interface LegislationItem {
  id: string;
  title: string;
  code: string;
  category: 'atama' | 'izin' | 'disiplin' | 'ekip' | 'sozlesmeli' | 'genel';
  summary: string;
  fullText: string;
  importantArticles: { number: string; title: string; content: string; implication: string }[];
  fullArticles?: { number: string; title: string; content: string }[];
  pdfUrl?: string; // PDF dosyası için yol
  additionalPdfs?: { label: string; url: string }[]; // Ek PDF dosyaları
  officialLink: string;
  lastUpdated: string;
}

const LEGISLATION_DATA: LegislationItem[] = [
  {
    id: 'atama-yer-degistirme',
    title: 'Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği',
    code: 'Yönetmelik / 29011',
    category: 'atama',
    summary: 'Sağlık Bakanlığı bünyesindeki sağlık hizmetleri sınıfı personelinin atama, nakil, eş durumu, sağlık mazereti ve bölge hizmeti gruplarını düzenleyen temel yönetmeliktir.',
    lastUpdated: '15.02.2025',
    pdfUrl: '/mevzuat/atama_yonetmelik.pdf',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19543&MevzuatTur=7&MevzuatTertip=5',
    fullText: 'Bu Yönetmelik; Sağlık Bakanlığı taşra teşkilatında görev yapan sağlık hizmetleri ve yardımcı sağlık hizmetleri sınıfı personelinin atama ve yer değiştirme işlemlerine dair usul ve esasları kapsar. Personelin unvan ve branşlarına göre hizmet bölgeleri (1. ila 6. bölge) ve bu bölgelerdeki asgari çalışma süreleri belirlenmiştir. Mazeret tayinleri, eş durumu mazereti, sağlık mazereti, can güvenliği mazereti ve olağanüstü durumlarda tayinler bu yönetmeliğin en çok işlem gören bölümleridir.',
    importantArticles: [
      {
        number: 'Madde 19',
        title: 'Sağlık Mazeretine Bağlı Yer Değişikliği',
        content: 'Kendisi, eşi, çocukları, annesi, babası veya vasisi olduğu kardeşinin hastalığının görev yaptığı yerde tedavisinin mümkün olmadığını, eğitim ve araştırma hastanesi veya üniversite hastanesinden alınacak heyet raporu ile belgelendirenler yer değişikliği talep edebilir.',
        implication: 'Raporda "başka yerde çalışması hayati öneme haizdir" ibaresi veya tedavinin o ilde yapılamayacağının açıkça belirtilmesi şarttır. EKİP sistemi tescil ekranına bu raporun taratılarak yüklenmesi gerekir.'
      },
      {
        number: 'Madde 20',
        title: 'Aile Birliği (Eş Durumu) Mazeretine Bağlı Yer Değişikliği',
        content: 'Eşlerin her ikisinin de Bakanlıkta memur olması halinde, ast-üst ilişkisi, unvan ve kadro durumuna göre öncelikli olarak vizeli boş pozisyona atama yapılır. Eşin diğer kamu kurumlarında (TFA, Emniyet, TSK vb.) çalışması durumunda, kurumun özel mevzuatı gereği yer değiştiremeyeceğine dair belge sunulmalıdır.',
        implication: 'Özel sektörde çalışan eşin son 4 yılda en az 720 gün SGK prim ödemesinin bulunması zorunludur. İşlemler EKİP üzerinden "Eş Durumu Başvurusu" modülüyle başlatılır.'
      },
      {
        number: 'Madde 26',
        title: 'Alt Bölge Tayinleri',
        content: 'Personel, kendi unvan ve branşında boş kadro bulunması ve hizmet grubu olarak daha alt bir bölge grubunda yer alması şartıyla, dönem kısıtlaması olmaksızın alt bölgelere yer değişikliği talep edebilir.',
        implication: '1. bölgeden 2, 3, 4, 5 veya 6. bölgelere yapılacak başvurular, personel dağılım cetveli (PDC) doluluk oranına bakılmaksızın ve kura aranmaksızın her zaman yapılabilir.'
      }
    ]
  },
  {
    id: '657-izinler-haklar',
    title: '657 Sayılı Devlet Memurları Kanunu - İzin ve Haklar',
    code: 'Kanun / 657',
    category: 'izin',
    summary: 'Devlet memurlarının yıllık, mazeret, hastalık, refakat ve aylıksız izin haklarını, izinlerin sürelerini ve kullanım usullerini düzenleyen kanun hükümleridir.',
    lastUpdated: '01.01.2026',
    pdfUrl: '/mevzuat/657_izinler.pdf',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=657&MevzuatTur=1&MevzuatTertip=5',
    fullText: '657 Sayılı Devlet Memurları Kanunu kapsamında çalışan tüm kadrolu sağlık personelinin yıllık izin, mazeret izni, hastalık ve refakat izni ile aylıksız izin hakları bu kanunda güvence altına alınmıştır. İzinlerin idare tarafından onaylanması, bütçe ve nöbet planlaması açısından önem taşır. İzin süreleri hizmet yılına göre (1 yıldan 10 yıla kadar 20 gün, 10 yıldan fazla olanlar için 30 gün) değişir.',
    importantArticles: [
      {
        number: 'Madde 102',
        title: 'Yıllık İzin Süreleri',
        content: 'Hizmeti 1 yıldan 10 yıla kadar (10 yıl dahil) olan memurlar için yıllık izin süresi yirmi gündür, hizmeti on yıldan fazla olanlar için otuz gündür. Zorunlu hallerde bu sürelere gidiş ve dönüş için en çok ikişer gün eklenebilir.',
        implication: 'Sağlık personeli için yıllık izinler, birim sorumlusu ve başhekimlik onayına tabidir. Kullanılmayan yıllık izinler sadece bir sonraki yıla devredebilir, sonraki yıllarda yanar.'
      },
      {
        number: 'Madde 104',
        title: 'Mazeret İzinleri',
        content: 'Memura; eşinin doğum yapması halinde 10 gün; kendisinin veya çocuğunun evlenmesi ya da eşinin, çocuğunun, kendisinin veya eşinin ana, baba ve kardeşinin ölümü hallerinde isteği üzerine 7 gün izin verilir. Kadın memura doğumdan önce 8, doğumdan sonra 8 hafta analık izni verilir.',
        implication: 'Mazeret izinleri amirin takdirinde değildir, yasal bir haktır. Doğum ve vefat belgelerinin EKİP Özlük modülüne işlenmesi ve dilekçe ekinde sunulması gereklidir.'
      },
      {
        number: 'Madde 105',
        title: 'Hastalık ve Refakat İzni',
        content: 'Memura, aylık ve özlük hakları korunarak, hekim raporuyla gösterilen lüzum üzerine hastalık izni verilebilir. Ayrıca bakmakla yükümlü olduğu anne, baba, eş ve çocuklarının ağır bir kaza geçirmesi veya tedavisi uzun süren bir hastalığının bulunması hallerinde 3 aya kadar refakat izni verilir.',
        implication: 'Tek hekim raporları bir defada en çok 10 gün, yılda toplam 40 günü geçemez. Bu süreyi aşan raporlar sağlık kurulu tarafından verilmelidir.'
      }
    ]
  },
  {
    id: 'sozlesmeli-personel-3-1',
    title: 'Sözleşmeli Sağlık Personeli İstihdamı (3+1 Modeli)',
    code: 'KHK / 663 Madde 45/A',
    category: 'sozlesmeli',
    summary: '663 sayılı KHK uyarınca KPSS puanıyla atanan sözleşmeli sağlık personelinin 3 yıl sözleşmeli, ardından kadroya geçerek 1 yıl da aday memur olarak çalışmasını öngören istihdam modelidir.',
    lastUpdated: '10.12.2025',
    pdfUrl: '/mevzuat/sozlesmeli_3art1.pdf',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=663&MevzuatTur=3&MevzuatTertip=5',
    fullText: 'Bu kanun maddesi uyarınca istihdam edilen sözleşmeli sağlık personeli, atandıkları yerlerde üç yıl süreyle fiilen görev yapmak zorundadır. Üç yıllık sürenin sonunda, yapılacak sınav veya performans değerlendirmesi ile başarılı olanlar talepleri halinde kadroya geçirilir. Kadroya geçirilen personel aynı yerde en az bir yıl daha görev yapmakla yükümlüdür.',
    importantArticles: [
      {
        number: 'KHK 45/A - Fıkra 3',
        title: 'Eş Durumu ve Mazeret Tayini Kısıtlaması',
        content: 'Sözleşmeli sağlık personeli, 3 yıllık çalışma süresini tamamlamadan eş durumu mazeretiyle yer değişikliği talebinde bulunamaz. Ancak eşinin de 663 sayılı KHK kapsamında sözleşmeli personel olması veya kamu görevlisi olması koşuluyla istisnalar mevcuttur.',
        implication: 'Eş durumu tayini isteyebilmek için iki tarafın da 3 yıllık fiili hizmet süresini doldurması ya da diğer eşin tayin imkanı olmayan bir kamu görevinde (TSK, Emniyet vb.) olması gerekir. Özel sektör çalışanları için eş durumu tayini 3 yıl dolmadan yapılamaz.'
      },
      {
        number: 'KHK 45/A - Fıkra 5',
        title: 'Kadroya Geçiş İşlemleri',
        content: '3 yıllık çalışma süresini tamamlayan sözleşmeli personel, EKİP portalı üzerinden yapılacak başvuru ve il sağlık müdürlüğü onayı ile kadrolu memur statüsüne (4/A) geçirilir.',
        implication: 'Kadroya geçiş yazısı tebliğ edildikten sonra personel "Aday Memur" olarak 1 yıl süreyle aynı kurumda görevine devam eder. Bu sürede "Yıllık İzin Devri" yapılamaz, hakları sıfırlanır.'
      }
    ]
  },
  {
    id: 'ekip-portal-yonerge',
    title: 'EKİP Portalı ve ÇKYS Entegrasyon Genelgesi',
    code: 'Yönerge / SB-BSGM-2024',
    category: 'ekip',
    summary: 'ÇKYS (Çekirdek Kaynak Yönetim Sistemi) ve EKİP entegrasyonu ile personelin tüm özlük, hareket ve eğitim bilgilerinin dijital ortamda güncel tutulmasını sağlayan teknik uygulama yönergesidir.',
    lastUpdated: '01.03.2026',
    pdfUrl: '/mevzuat/ekip_yonerge.pdf',
    officialLink: '#',
    fullText: 'Sağlık Bakanlığı personelinin tüm atama, ayrılış, başlama ve sertifika tescil işlemlerinin EKİP (Entegre Kurumsal İşlem Platformu) üzerinden yürütülmesine dair usul ve esasları belirler.',
    importantArticles: [
      {
        number: 'Madde 4',
        title: 'Anlık Göreve Başlama ve Ayrılış Tescili',
        content: 'Açıktan atanan, tayini çıkan veya ücretsiz izne ayrılan tüm personelin göreve başlama ve ayrılış bildirimleri, fiili işlemin gerçekleştiği gün mesai bitimine kadar EKİP platformuna işlenmek zorundadır.',
        implication: 'Gecikmeli girilen tesciller SGK işe giriş/çıkış bildirgeleriyle çeliştiğinde kuruma idari para cezası uygulanır. Sorumluluk işlemi yapan özlük birimindedir.'
      },
      {
        number: 'Madde 8',
        title: 'Hizmet İçi Eğitim ve Sertifika Tescilleri',
        content: 'Bakanlık onaylı sertifikalı eğitimler ile kurum içi zorunlu eğitimler EKİP sistemi üzerinde tescil edilmedikçe personelin özlük dosyasında ve hizmet puanı hesaplamasında geçerli kabul edilmez.',
        implication: 'Özellikle yoğun bakım, acil tıp ve ameliyathane sertifikalarının EKİP tescili, o birimlerde "Sertifikalı Personel" olarak çalıştırılabilme şartının önkoşuludur.'
      }
    ],
    fullArticles: [
      { number: 'Madde 1', title: 'Sistem Kapsamı', content: 'EKİP sistemi tüm bakanlık merkez ve taşra teşkilatını kapsayan ana tescil platformudur.' },
      { number: 'Madde 2', title: 'Veri Giriş Yetkisi', content: 'Birim amirleri tarafından yetkilendirilen özlük birim personeli veri girişinden sorumludur.' },
      { number: 'Madde 12', title: 'Gizlilik', content: 'Personel verilerinin gizliliği ve güvenliği KVKK hükümlerine tabidir.' }
    ]
  },
  {
    id: '657-disiplin-hukumleri',
    title: '657 Sayılı Kanun - Disiplin Hükümleri ve Cezalar',
    code: 'Kanun / 657 - Disiplin',
    category: 'disiplin',
    summary: 'Sağlık personeline uygulanabilecek disiplin cezalarını, cezayı gerektiren fiilleri, savunma hakkı ve zamanaşımı sürelerini belirleyen yasal çerçevedir.',
    lastUpdated: '10.01.2026',
    pdfUrl: '/mevzuat/disiplin_hukumleri.pdf',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=657&MevzuatTur=1&MevzuatTertip=5',
    fullText: 'Devlet memurlarının kamu hizmetlerini düzenli ve etkin bir şekilde yürütmesini sağlamak amacıyla, kanun, tüzük ve yönetmeliklerin emrettiği ödevleri yurt içinde veya yurt dışında yerine getirmeyenlere, uyulmasını zorunlu kıldığı hususları yapmayanlara uygulanacak disiplin cezaları belirlenmiştir. Cezalar; Uyarma, Kınama, Aylıktan Kesme, Kademe İlerlemesinin Durdurulması ve Devlet Memurluğundan Çıkarma şeklindedir.',
    importantArticles: [
      {
        number: 'Madde 125',
        title: 'Disiplin Cezası Çeşitleri ve Cezayı Gerektiren Fiiller',
        content: 'Uyarma, Kınama, Aylıktan kesme (Brüt aylığın 1/30 - 1/8 oranında kesilmesi), Kademe ilerlemesinin durdurulması (1 - 3 yıl süreyle) ve Devlet memurluğundan çıkarma cezalarının hangi somut kusurlu davranışlarda verileceğini tek tek listeler.',
        implication: 'Göreve özürsüz olarak 1 veya 2 gün gelmemek Aylıktan Kesme cezası; kesintisiz 3-9 gün gelmemek Kademe İlerlemesinin Durdurulması cezası; bir yılda toplam 20 gün gelmemek ise Memuriyetten Çıkarma cezası gerektirir.'
      },
      {
        number: 'Madde 129',
        title: 'Savunma Hakkı ve Karar Süresi',
        content: 'Devlet memuru hakkında savunması alınmadan disiplin cezası verilemez. Soruşturmayı yapanın veya yetkili disiplin kurulunun yedi günden az olmamak üzere verdiği süre içinde veya belirtilen tarihte savunmasını yapmayan memur, savunma hakkından vazgeçmiş sayılır.',
        implication: 'Disiplin soruşturmalarında memura en az 7 gün yazılı savunma süresi tanınması zorunludur. Aksi halde verilen ceza idari mahkemelerce usul yönünden iptal edilir.'
      }
    ],
    fullArticles: [
      { number: 'Madde 125', title: 'Cezalar', content: 'Disiplin cezaları ağırlık derecelerine göre sıralanmıştır.' },
      { number: 'Madde 126', title: 'Yetki', content: 'Disiplin cezası vermeye yetkili amirler ve kurullar.' },
      { number: 'Madde 127', title: 'Zamanaşımı', content: 'Disiplin cezasını gerektiren fiillerde soruşturma ve ceza zamanaşımı süreleri.' }
    ]
  },
  {
    id: '4924-sozlesmeli-mevzuat',
    title: '4924 Sayılı Kanun ve Sözleşmeli Personel Yönetmeliği',
    code: 'Kanun / 4924',
    category: 'sozlesmeli',
    summary: 'Eleman temininde güçlük çekilen yerlerde sözleşmeli sağlık personeli istihdamını, atama ve yer değiştirme usullerini düzenleyen mevzuattır.',
    lastUpdated: '09.07.2026',
    fullText: '4924 sayılı Kanun kapsamında istihdam edilen personelin atama, yer değiştirme ve hizmet sözleşmesi esasları bu mevzuatla belirlenmiştir. Personelin hizmet hedeflerine uyumu, sözleşme yenileme kriterleri ve mazeret tayinleri (eş durumu, sağlık vb.) detaylandırılmıştır. Özellikle stratejik personel (Tabip, Uzman Tabip) istihdamı için kritik öneme sahiptir.',
    importantArticles: [
      {
        number: 'Madde 4',
        title: 'Atanma Şartları',
        content: '657 sayılı Devlet Memurları Kanununun 48 inci maddesinde belirtilen genel şartlar ile 4924 sayılı Kanuna ekli (1) sayılı cetvelde belirtilen niteliklere sahip olmaları şarttır.',
        implication: 'Genel memuriyet şartlarının yanı sıra unvan ve birime özel koşullar aranabilir.'
      },
      {
        number: 'Madde 5',
        title: 'Atama ve Yerleştirme Esasları',
        content: 'Sınav, kura, hizmet puanı, norm fazlası durumu, eş durumu ve sağlık mazereti gibi tüm atama kriterlerini ve başvuru usullerini kapsar.',
        implication: 'Yerleştirmeler unvan değişikliği için yılda bir kez, ilk defa/yeniden atama için yılda en fazla üç kez yapılabilir.'
      },
      {
        number: 'Madde 6',
        title: 'Kısıtlayıcı Hükümler',
        content: 'Atama koşullarına uymayan, belgelerini teslim etmeyen veya göreve başlamayanlar bir yıl boyunca sözleşmeli personel olarak atanamazlar.',
        implication: 'Göreve başlamama durumunda ciddi bir hak mahrumiyeti (1 yıl atanamama) söz konusudur.'
      }
    ],
    fullArticles: [
      { 
        number: 'Madde 1', 
        title: 'Amaç ve Kapsam', 
        content: 'Bu Yönetmelik, Sağlık Bakanlığı taşra teşkilatında 10/7/2003 tarihli ve 4924 sayılı Eleman Temininde Güçlük Çekilen Yerlerde Sözleşmeli Sağlık Personeli Çalıştırılması ile Bazı Kanun ve Kanun Hükmünde Kararnamelerde Değişiklik Yapılması Hakkında Kanuna göre istihdam edilecek sözleşmeli sağlık personelinin atanmalarına ilişkin usul ve esasları belirlemek amacıyla düzenlenmiştir.' 
      },
      { 
        number: 'Madde 2', 
        title: 'Dayanak', 
        content: 'Bu Yönetmelik, 4924 sayılı Kanunun 4 üncü maddesine dayanılarak hazırlanmıştır.' 
      },
      { 
        number: 'Madde 3', 
        title: 'Tanımlar', 
        content: 'Bu Yönetmelikte geçen; a) Atama: Hizmet sözleşmesinin karşılıklı olarak imzalanması suretiyle sözleşmeli personel pozisyonlarına ilk defa, yeniden veya yer değiştirme suretiyle yapılacak atama işlemlerini, c) Bakanlık: Sağlık Bakanlığını, ç) Hizmet bölgesi: Devlet Memurlarının Yer Değiştirme Suretiyle Atanmalarına İlişkin Yönetmeliğin ekinde yer alan (1) sayılı cetvelde gösterilen illerin gruplarını, e) Kura: Tıpta uzmanlık mevzuatına göre uzman olanlar ile tabip, diş tabibi ve eczacı pozisyonlarına yapılacak yerleştirmelerde; ilgililerin katılımına açık olarak Bakanlık tarafından yapılacak tespit yöntemini, f) Merkezi yerleştirme: KPSS sonucu esas alınarak ÖSYM tarafından yapılacak olan yerleştirme işlemini, g) Sözleşmeli personel: 4924 sayılı Kanuna ekli (1) sayılı cetvelde belirtilen pozisyon unvanlarından birinde görev yapan personeli ifade eder.' 
      },
      { 
        number: 'Madde 4', 
        title: 'Atanma Şartları', 
        content: 'Sözleşmeli personel olarak atanacakların; 657 sayılı Devlet Memurları Kanununun 48 inci maddesinde belirtilen genel şartlar ile 4924 sayılı Kanuna ekli (1) sayılı cetvelde belirtilen niteliklere sahip olmaları şarttır. Bunun yanında Bakanlık, sözleşmeli personel olarak atanacaklar için, istihdam edilecek unvan ve hizmet biriminin gerektirdiği özel koşulları ayrıca belirleyebilir.' 
      },
      { 
        number: 'Madde 5', 
        title: 'Atama ve Yerleştirme İşlemleri', 
        content: '(1) Yerleştirmeler; unvan değişikliği için yılda bir kez, ilk defa/yeniden atama için yılda en fazla üç kez yapılır. (2) Esaslar: a) Sınav/kura sonucu yerleşenler Bakanlık taşra teşkilatına başvurur. b) Uzman, tabip, diş tabibi, eczacı kura ile; diğerleri merkezi yerleştirme ile atanır. e) Yer değişikliklerinde en az bir yıl fiilen çalışma şarttır. f) Becayiş (Karşılıklı yer değiştirme) aynı bölge, unvan ve branşta 1 yıl çalışma sonrası mümkündür. g) Usulüne aykırı fesihte 2 yıl yeniden atama yapılamaz. j) Eş Durumu: Eşin görev yeri değişikliği mümkün değilse, 1 yıl çalışma şartıyla vizeli boş pozisyona atanabilir. k) Sağlık Mazereti: Tedavinin mümkün olmadığı kurul raporuyla belgelenirse nakil yapılabilir. l) Can Güvenliği: Hayati tehlike belgelenirse yer değişikliği yapılır. m) Şiddet (6284 Sayılı Kanun): Koruyucu tedbir kararı alanlar için yer değişikliği uygulanır. n) Geçici Görev: Afet, sıkıyönetim, OHAL durumlarında veya eğitim amacıyla (toplam 3 ayı geçmemek üzere) yapılabilir.' 
      },
      { 
        number: 'Madde 5/j', 
        title: 'Eş Durumu Mazereti', 
        content: 'Sözleşmeli personel; pozisyonunun vizeli olduğu birimde fiilen en az bir yıl görev yapması ve kamu personeli olan eşinin kurum içi görev yeri değişikliğinin mümkün olmadığını belgelendirmesi kaydıyla, eş durumu nedeniyle naklen atanabilir.' 
      },
      { 
        number: 'Madde 5/k', 
        title: 'Sağlık Mazereti', 
        content: 'Kendisinin, eşinin, anne, baba veya çocuklarının hastalığının tedavisinin mümkün olmadığını üniversite veya eğitim araştırma hastanelerinden alınacak sağlık kurulu raporu ile belgelendirenler, uygun boş pozisyonlara naklen atanabilir.' 
      },
      { 
        number: 'Madde 5/f', 
        title: 'Karşılıklı Yer Değiştirme (Becayiş)', 
        content: 'Aynı hizmet bölgesi illerde aynı unvan ve branşta bir yıl çalışan sözleşmeli personel, uygun görülmesi hâlinde karşılıklı olarak yer değiştirebilir.' 
      },
      { 
        number: 'Madde 6', 
        title: 'Kısıtlayıcı Hükümler', 
        content: '(1) Şartlara uymayan, belge teslim etmeyen veya göreve başlamayanlar 1 yıl boyunca yeniden sözleşmeli personel olamazlar. (2) Gerçeğe aykırı beyan verenler hak iddia edemez ve sözleşmeleri feshedilir.' 
      },
      { 
        number: 'Madde 7', 
        title: 'Yürürlükten Kaldırılan Yönetmelik', 
        content: '2/9/2003 tarihli ve 25217 sayılı Resmî Gazete’de yayımlanan Sözleşmeli Sağlık Personeli Atama ve Nakil Yönetmeliği yürürlükten kaldırılmıştır.' 
      },
      { 
        number: 'Madde 8', 
        title: 'Yürürlük', 
        content: 'Bu Yönetmelik yayımı tarihinde (11/2/2015) yürürlüğe girer.' 
      },
      { 
        number: 'Madde 9', 
        title: 'Yürütme', 
        content: 'Bu Yönetmelik hükümlerini Sağlık Bakanı yürütür.' 
      }
    ],
    pdfUrl: '/mevzuat/4924_yonetmelik.pdf',
    additionalPdfs: [
      { label: '4924 Genelge', url: '/mevzuat/4924_genelge.pdf' }
    ],
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4924&MevzuatTur=1&MevzuatTertip=5'
  },
  {
    id: 'atama-yer-degistirme-yonetmelik',
    title: 'Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği (Ayrıntılı)',
    code: 'Yönetmelik / 17332',
    category: 'atama',
    summary: 'Sağlık Bakanlığı bünyesindeki sağlık ve yardımcı sağlık hizmetleri personelinin atama, nakil ve yer değiştirme süreçlerini düzenleyen temel yönetmeliktir.',
    lastUpdated: '27.11.2024',
    fullText: 'Bu Yönetmelik; Sağlık Bakanlığı taşra teşkilatında görev yapan sağlık hizmetleri ve yardımcı sağlık hizmetleri sınıfı personelini kapsar. Atama dönemleri, hizmet puanı hesaplanması, mazeret tayinleri (eş durumu, sağlık, can güvenliği) ve isteğe bağlı yer değişiklikleri bu mevzuatın temelini oluşturur.',
    importantArticles: [
      {
        number: 'Madde 16',
        title: 'İsteğe Bağlı Yer Değiştirme',
        content: 'İller arası atama dönemleri Ocak ve Haziran aylarıdır. Atamalar, tercih sırasına bakılmaksızın hizmet puanına göre yapılır.',
        implication: 'Tayin dönemlerini takip etmek ve hizmet puanını güncel tutmak kritiktir.'
      },
      {
        number: 'Madde 19',
        title: 'Sağlık Mazereti',
        content: 'Personelin kendisinin veya bakmakla yükümlü olduğu yakınlarının hastalığının görev yaptığı yerde tehlikeye girdiğinin sağlık kurulu raporuyla belgelenmesi halidir.',
        implication: 'Üniversite veya Eğitim Araştırma hastanelerinden alınacak güncel heyet raporu gereklidir.'
      },
      {
        number: 'Madde 20',
        title: 'Aile Birliği Mazereti',
        content: 'Eşlerin her ikisinin de Bakanlıkta kamu personeli olması halinde astlık üstlük sıralaması esas alınarak yer değişikliği yapılır.',
        implication: 'Stratejik personel (tabip vb.) için özel hükümler ve kısıtlamalar mevcuttur.'
      }
    ],
    fullArticles: [
      { number: 'Madde 1', title: 'Amaç', content: 'Sağlık hizmetlerinin yurt genelinde etkin ve verimli bir şekilde yürütülebilmesi için personelin atama ve yer değiştirmelerine ilişkin usul ve esasları düzenlemektir.' },
      { number: 'Madde 2', title: 'Kapsam', content: 'Sağlık Bakanlığı taşra teşkilatında görev yapan sağlık hizmetleri ve yardımcı sağlık hizmetleri sınıfı personelini kapsar.' },
      { number: 'Madde 4', title: 'Tanımlar', content: 'PDC (Personel Dağılım Cetveli), Hizmet Puanı, Stratejik Personel ve Hizmet Bölgesi gibi temel kavramları tanımlar.' },
      { number: 'Madde 6', title: 'Hizmet Bölgeleri', content: 'İller 6 hizmet bölgesine ayrılır. Genel Yönetmelikteki değişiklikler aynen yansıtılır.' },
      { number: 'Madde 8', title: 'Hizmet Puanı', content: 'Atama ve yer değiştirme işlemlerinde kullanılmak üzere, çalışılan yerin özelliklerine göre hesaplanan puandır.' },
      { number: 'Madde 16', title: 'İsteğe Bağlı Yer Değiştirme', content: 'Ocak ve Haziran aylarında yapılan dönem tayinlerini ve mazeret dışı yer değişikliklerini düzenler.' },
      { number: 'Madde 19', title: 'Sağlık Mazereti', content: 'Hastalık durumunda yapılacak yer değişikliklerini ve kurul raporu şartlarını belirler.' },
      { number: 'Madde 20', title: 'Aile Birliği Mazereti', content: 'Eş durumu tayinlerini, astlık-üstlük ilişkisini ve stratejik personel durumunu detaylandırır.' },
      { number: 'Madde 21', title: 'Can Güvenliği Mazereti', content: 'Hayati tehlike veya şiddet durumunda (6284 sayılı Kanun) yapılacak acil yer değişikliklerini kapsar.' }
    ],
    pdfUrl: '/mevzuat/atama_yonetmelik.pdf',
    officialLink: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17332&MevzuatTur=7&MevzuatTertip=5'
  },
  {
    id: 'surekli-isci-tis-2025',
    title: 'Sürekli İşçi Toplu İş Sözleşmesi (2025-2026)',
    code: 'TİS / 2025-2026',
    category: 'genel',
    summary: 'Sağlık Bakanlığı ile Öz Sağlık-İş arasında 28.08.2025 tarihinde imzalanan güncel Toplu İş Sözleşmesi.',
    lastUpdated: '28.08.2025',
    pdfUrl: '/mevzuat/isci_tis_2025.pdf',
    officialLink: '#',
    fullText: '01.01.2025 - 31.12.2026 dönemini kapsayan işletme toplu iş sözleşmesidir. İşçilerin tüm mali, sosyal ve idari haklarını düzenler.',
    importantArticles: [
      {
        number: 'Madde 30',
        title: 'Yıllık Ücretli İzin Süreleri',
        content: 'Hizmeti 1-10 yıl arası olanlara 20 gün, 10 yıl ve üzeri olanlara 30 gün izin verilir. Cumartesi iş günü sayılır.',
        implication: 'İzinler bölünerek kullanılabilir. Kullanılmayan izinler bir sonraki yıla aktarılabilir veya akit feshinde ücreti ödenir.'
      },
      {
        number: 'Madde 30/d',
        title: 'Mazeret İzinleri',
        content: 'Eşin doğumu: 5 gün, Evlilik: 5 gün, Yakın vefatı: 5 gün, Tabii afet: 7 gün ücretli mazeret izni verilir.',
        implication: 'Bu izinler iş günü olarak hesaplanır ve yıllık izinden düşülmez.'
      },
      {
        number: 'Madde 33/39/41',
        title: 'Mali Haklar ve Yardımlar',
        content: 'Günlük brüt ücret 1.400 TL + 40 TL seyyanen zam. Yemek yardımı net 235,02 TL/Gün, Giyim yardımı yıllık brüt 2.810,19 TL.',
        implication: 'Ücretlere her altı ayda bir TİS\'te belirtilen oranlarda (01.07.2025\'te %11 + enflasyon farkı gibi) zam uygulanır.'
      },
      {
        number: 'Madde 38',
        title: 'Fazla Çalışma ve Gece Mesaisi',
        content: 'Normal haftalık çalışma süresi 40 saattir. Fazla çalışma ücreti normal ücretin %100 zamlı haliyle ödenir. Gece çalışmaları için saat başı ek tazminat ödenir.',
        implication: 'Haftalık 40 saati aşan her saat fazla mesai sayılır. Gece vardiyası dönüşümlerinde en az 11 saat dinlenme süresi şarttır.'
      },
      {
        number: 'Madde 45',
        title: 'Sosyal Yardım Ödemeleri',
        content: 'Evlenme yardımı: 4.500 TL, Doğum yardımı: 2.250 TL, Ölüm yardımı (çalışanın kendisi): 12.000 TL, Yakın ölümü: 3.500 TL.',
        implication: 'Bu ödemeler net tutarlar olup, olayın vuku bulduğu ayı takip eden ilk maaş döneminde ödenir.'
      },
      {
        number: 'Madde 53 (Ek-1)',
        title: 'Disiplin Hükümleri',
        content: 'Göreve geç gelme, izinsiz ayrılma veya işi aksatma hallerinde İhtar, Yevmiye Kesme ve İşten Çıkarma cezaları uygulanır.',
        implication: 'Disiplin kurulunda sendika temsilcisi bulunur. Savunma hakkı kutsaldır, cezalara itiraz süreci mevzuata tabidir.'
      }
    ],
    fullArticles: [
      { number: 'Madde 1', title: 'Amaç', content: 'Bu toplu iş sözleşmesinin amacı, işyerinde düzenli ve verimli çalışmayı sağlamak, üretimi artırmak, çalışanların hak ve menfaatlerini korumaktır.' },
      { number: 'Madde 2', title: 'Kapsam', content: 'Bu sözleşme Sağlık Bakanlığı ve bağlı işyerlerinde çalışan sürekli işçileri kapsar.' },
      { number: 'Madde 15', title: 'Haftalık Çalışma Süresi', content: 'Haftalık çalışma süresi 40 saattir. Bu süre haftada en çok 5 gün çalışılmak suretiyle uygulanır.' },
      { number: 'Madde 22', title: 'Ücret Ödeme Günü', content: 'İşçi ücretleri her ayın 15. günü ödenir. Ödeme günü tatile rastlarsa bir önceki iş günü ödeme yapılır.' },
      { number: 'Madde 30', title: 'Yıllık İzin', content: '1-10 yıl arası 20 gün, 10 yıl üzeri 30 gün ücretli yıllık izin verilir.' },
      { number: 'Madde 41', title: 'Giyim Yardımı', content: 'İşçilere her yıl Nisan ayında unvanlarına uygun koruyucu giyim yardımı nakdi olarak ödenir.' }
    ]
  }
];

interface FAQItem {
  question: string;
  answer: string;
  reference: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'Eş durumu tayini için özel sektörde çalışan eşin kaç gün prim ödemiş olması gerekir?',
    answer: 'Özel sektörde aktif çalışan eşin, başvuru tarihi itibarıyla son dört yılda en az 720 gün sosyal güvenlik primi ödenmiş olması ve halen çalışıyor olması şarttır. Kesintili primler de bu hesaba dahil edilir.',
    reference: 'Sağlık Bakanlığı Atama ve Yer Değiştirme Yönetmeliği - Madde 20',
    tags: ['Eş Durumu', 'Tayin', 'Özel Sektör']
  },
  {
    question: 'Hizmet yılına göre yıllık izin hakları kaç gündür ve sonraki yıla devreder mi?',
    answer: 'Hizmet süresi 1 yıldan 10 yıla kadar olan memurların 20 gün, 10 yıldan fazla olan memurların ise 30 gün yıllık izin hakkı bulunur. Cari yılda kullanılmayan izin hakları sadece takip eden bir sonraki takvim yılına devreder. İkinci yılda da kullanılmayan izinler tamamen yanar.',
    reference: '657 Sayılı Kanun - Madde 102 & 103',
    tags: ['Yıllık İzin', 'Haklar', 'İzin Devri']
  },
  {
    question: 'Sözleşmeli (3+1) sağlık personeli hangi hallerde tayin isteyebilir?',
    answer: '3 yıllık sözleşmeli süresini doldurmayan personel ancak can güvenliği mazereti, eşinin de başka bir ilde 663 KHK kapsamında sözleşmeli personel olması veya eşinin nakli mümkün olmayan bir kamu görevlisi olması durumunda kısıtlı mazeret tayini isteyebilir. Standart eş durumu veya eğitim durumu tayini için 3 yılın fiilen dolması gerekir.',
    reference: '663 Sayılı KHK - Madde 45/A',
    tags: ['3+1', 'Sözleşmeli', 'Tayin Kısıtlaması']
  },
  {
    question: 'Göreve mazeretsiz olarak kaç gün gelmemek memuriyetten çıkarma cezası gerektirir?',
    answer: 'Özürsüz veya izinsiz olarak kesintisiz 10 gün göreve gelmeyen memur, yazılı uyarıya gerek kalmaksızın çekilmiş (istifa etmiş) sayılır. Bir takvim yılı içinde toplamda mazeretsiz 20 gün göreve gelmeyen memurun ise devlet memurluğundan çıkarma cezası ile ilişiği kesilir.',
    reference: '657 Sayılı Kanun - Madde 94 & Madde 125',
    tags: ['Müstafi', 'Disiplin', 'Memuriyetten Çıkarma']
  },
  {
    question: 'Hastalık raporları kuruma ne kadar sürede teslim edilmelidir?',
    answer: 'Hastalık raporlarının, alındığı günün mesai saati bitimine kadar veya en geç ertesi gün mesai başlangıcına kadar sözlü ya da elektronik iletişim kanallarıyla birim amirine bildirilmesi ve asıllarının en geç 3 iş günü içinde kuruma teslim edilmesi şarttır.',
    reference: 'Devlet Memurlarına Verilecek Hastalık Raporları Yönetmeliği - Madde 7',
    tags: ['Sağlık Raporu', 'Hastalık İzni', 'Teslim Süresi']
  },
  {
    question: '4924 sayılı Kanuna tabi personelin eş durumu tayini şartı nedir?',
    answer: '4924 sayılı Kanun kapsamındaki personelin eş durumu tayini isteyebilmesi için, pozisyonunun vizeli olduğu ilde fiilen en az bir yıl görev yapmış olması zorunludur.',
    reference: '4924 Atama ve Yer Değiştirme Yönetmeliği - Madde 5/j',
    tags: ['4924', 'Eş Durumu', 'Tayin']
  },
  {
    question: 'Sürekli işçilerin (Öz Sağlık-İş TİS) yıllık izin süreleri 2025 itibarıyla nasıldır?',
    answer: 'Hizmet süresi 1-10 yıl olan işçilere 20 gün, 10 yıldan fazla olanlara ise 30 gün yıllık ücretli izin verilir. Cumartesi günleri de izin hesabında iş günü kabul edilir.',
    reference: '2025-2026 Öz Sağlık-İş TİS - Madde 30',
    tags: ['İşçi', 'Yıllık İzin', 'TİS 2025']
  }
];

export function MevzuatBankasi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<LegislationItem | null>(null);
  const [innerSearch, setInnerSearch] = useState(''); // Detay paneli içi arama
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper for opening external links (supports system browser in Electron)
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    const isStandalone = window.location.search.includes('view=mascot-only') || (window as any).ipcRenderer;
    if (isStandalone && (window as any).ipcRenderer) {
      e.preventDefault();
      (window as any).ipcRenderer.send('open-external-link', url);
    }
  };

  const filteredLegislation = useMemo(() => {
    return LEGISLATION_DATA.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const filteredFaq = useMemo(() => {
    if (!faqSearch) return FAQ_DATA;
    return FAQ_DATA.filter(faq => 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(faqSearch.toLowerCase()))
    );
  }, [faqSearch]);

  const filteredInnerArticles = useMemo(() => {
    if (!selectedItem?.fullArticles) return [];
    if (!innerSearch) return selectedItem.fullArticles;
    return selectedItem.fullArticles.filter(art => 
      art.number.toLowerCase().includes(innerSearch.toLowerCase()) ||
      art.title.toLowerCase().includes(innerSearch.toLowerCase()) ||
      art.content.toLowerCase().includes(innerSearch.toLowerCase())
    );
  }, [selectedItem, innerSearch]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'Tüm Mevzuatlar', icon: BookOpen },
    { id: 'atama', label: 'Atama & Nakil', icon: Briefcase },
    { id: 'izin', label: 'İzin & Haklar', icon: Calendar },
    { id: 'disiplin', label: 'Disiplin & Soruşturma', icon: ShieldAlert },
    { id: 'sozlesmeli', label: 'Sözleşmeli Personel (3+1)', icon: Clock },
    { id: 'ekip', label: 'EKİP & ÇKYS Sistemleri', icon: FileText },
  ];

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/20">
              <Scale size={14} /> Sağlık Mevzuatı Portalı
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Sağlık Mevzuatı ve Karar Destek Bilgi Bankası</h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              İl Sağlık Müdürlüğü ve bağlı sağlık tesisleri için atama, nakil, özlük hakları, disiplin işlemleri ve EKİP sistem entegrasyonuna ilişkin resmi mevzuat ve uygulama esasları rehberi.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button 
                onClick={() => {
                  alert("Yeni Mevzuat Ekleme:\n\n1. PDF dosyanızı yan taraftaki Asistan'a gönderin.\n2. 'Bu PDF'i Mevzuat Bilgi Bankasına ekler misin?' diye sorun.\n3. Asistan içeriği analiz edip sisteme entegre edecektir.");
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <FileText size={14} className="text-blue-400" /> MEVZUAT NASIL EKLENİR?
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shrink-0 self-stretch md:self-center flex flex-col justify-center">
            <div className="text-xs text-slate-300 font-bold tracking-wider uppercase mb-1">YÜKLÜ MEVZUAT METNİ</div>
            <div className="text-2xl font-black text-white flex items-baseline gap-1">
              {LEGISLATION_DATA.length} <span className="text-xs text-blue-300 font-normal">Ana Kategorilerde</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Mevzuat Arama ve Liste */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BookMarked size={18} className="text-blue-600" />
                Resmi Mevzuat Kılavuzları
              </h3>
              
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mevzuat veya kanun ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legislation Cards */}
          <div className="space-y-4">
            {filteredLegislation.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search size={20} />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Arama Sonucu Bulunamadı</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Girdiğiniz arama terimine uygun mevzuat kaydı bulunmamaktadır. Farklı anahtar kelimelerle arama yapmayı veya filtreleri sıfırlamayı deneyebilirsiniz.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            ) : (
              filteredLegislation.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition-all group"
                >
                  <div className="p-5 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.code}
                          </span>
                          <span className="text-[10px] text-slate-400">Güncelleme: {item.lastUpdated}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          {item.title}
                          {(item.pdfUrl || (item.additionalPdfs && item.additionalPdfs.length > 0)) && (
                            <span className="bg-red-50 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1 shrink-0">
                              <FileText size={10} /> PDF
                            </span>
                          )}
                        </h4>
                      </div>
                      
                      <a 
                        href={item.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleLinkClick(e, item.officialLink)}
                        className="text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all shrink-0 border border-slate-100"
                        title="Resmi Mevzuat Sistemine Git"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      {item.summary}
                    </p>

                    {/* Important Articles Quick List */}
                    <div className="space-y-3 pt-2">
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Öne Çıkan Önemli Maddeler</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.importantArticles.slice(0, 2).map((art, idx) => (
                          <div 
                            key={idx}
                            className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 p-3.5 rounded-xl transition-all cursor-pointer flex flex-col justify-between"
                            onClick={() => setSelectedItem(item)}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                  {art.number}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">{art.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                                {art.content}
                              </p>
                            </div>
                            <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-2 justify-end">
                              İncele <ArrowUpRight size={11} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 flex-wrap gap-3">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Sağlık Kurumu İş Akışları & Özlük Uyumluluğu İçin Önemlidir.
                      </span>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <BookOpen size={13} /> Tamamını ve Maddeleri İncele
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: Soru-Cevap & Faydalı İpuçları */}
        <div className="space-y-6">
          {/* Hızlı Soru-Cevap Simgesi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <HelpCircle size={18} className="text-indigo-600" />
                Mevzuat Soru-Cevap
              </h3>
              <p className="text-xs text-slate-500">
                Sık karşılaşılan özlük ve tescil senaryolarına yönelik hızlı çözümler.
              </p>
            </div>

            {/* Soru Arama Kutusu */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Soru veya etiket ara..."
                value={faqSearch}
                onChange={(e) => {
                  setFaqSearch(e.target.value);
                  setExpandedFaqIndex(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredFaq.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">Kriterlere uygun soru bulunamadı.</p>
              ) : (
                filteredFaq.map((faq, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30 hover:bg-slate-50 transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full text-left p-3.5 flex items-start justify-between gap-2.5 cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed">
                          {faq.question}
                        </span>
                        <span className="text-slate-400 shrink-0 pt-0.5">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-slate-100 text-[11px] text-slate-600 space-y-3 animate-in slide-in-from-top-1 duration-150">
                          <p className="leading-relaxed font-medium text-slate-600">
                            {faq.answer}
                          </p>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/60 flex items-start gap-1">
                            <span className="font-bold text-indigo-600">Referans:</span>
                            <span className="font-mono text-[10px] text-slate-500">{faq.reference}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {faq.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mevzuat Uyarı Paneli */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-200/60 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle size={18} className="shrink-0" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider">İdari Süreç Uyarısı</h4>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Mevzuatta yapılan değişiklikler ve EKİP sistemindeki güncellemeler, İl Sağlık Müdürlükleri tarafından duyurulmaktadır. İşlemleri gerçekleştirmeden önce mutlaka en güncel bakanlık tebliğlerini kontrol ediniz.
            </p>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100 text-[10px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-700">📌 Hatırlatma:</div>
              Özlük tescil işlemlerinin geriye dönük hatalı yapılması, SGK cezalarına ve personelin mali kayıplarına neden olabilir.
            </div>
          </div>
        </div>
      </div>

      {/* Legislation Detail Modal / Drawer */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative border border-slate-200 my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 md:p-8 text-white relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="relative group hidden sm:block">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    placeholder="Mevzuat içinde ara..."
                    value={innerSearch}
                    onChange={(e) => setInnerSearch(e.target.value)}
                    className="bg-white/10 hover:bg-white/20 focus:bg-white/25 border border-white/20 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all w-48 md:w-64"
                  />
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
                  title="Kapat"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-2 max-w-[90%] md:max-w-[60%]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-blue-100">
                    {selectedItem.code}
                  </span>
                  <span className="text-[10px] text-blue-200">Güncelleme: {selectedItem.lastUpdated}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight">{selectedItem.title}</h3>
              </div>
            </div>

            {/* Mobile Search Bar (Sticky) */}
            <div className="sm:hidden p-4 border-b border-slate-100 sticky top-0 bg-white z-10 shadow-sm">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mevzuat içinde ara..."
                  value={innerSearch}
                  onChange={(e) => setInnerSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* Scope & Full Text Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-600" /> Kapsam ve Genel Bakış
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {selectedItem.fullText}
                </p>
              </div>

              {/* Important Articles Full Specification */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={14} className="text-blue-600" /> Kritik Maddeler ve İdari Yansımaları
                  </h4>
                </div>
                
                <div className="space-y-4">
                  {selectedItem.importantArticles.map((art, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-3 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-2.5">
                        <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg">
                          {art.number}
                        </span>
                        <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">{art.title}</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          <strong>Kanun/Yönetmelik Metni:</strong> {art.content}
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-[11px] text-blue-900 flex gap-2">
                          <CheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Kurumsal Uygulama & Öneri:</strong> {art.implication}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full Articles Search & List */}
                {selectedItem.fullArticles && (
                  <div className="pt-6 space-y-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Scale size={14} className="text-indigo-600" /> Tüm Mevzuat Maddeleri
                    </h4>

                    <div className="space-y-2">
                      {filteredInnerArticles.length === 0 ? (
                        <p className="text-center py-4 text-[11px] text-slate-400 italic">Aranan kelimeye uygun madde bulunamadı.</p>
                      ) : (
                        filteredInnerArticles.map((art, idx) => (
                          <div key={idx} className="p-3 border border-slate-100 rounded-xl hover:border-blue-100 transition-all group">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-indigo-600">{art.number}</span>
                              <span className="text-[10px] font-bold text-slate-700">{art.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                              {art.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <button
                onClick={() => handleCopyText(selectedItem.title + '\n\n' + selectedItem.fullText, selectedItem.id)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {copiedId === selectedItem.id ? (
                  <>
                    <Check size={14} className="text-green-600" /> Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Bilgileri Kopyala
                  </>
                )}
              </button>

              <div className="flex flex-wrap gap-2">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setSelectedItem(prev => prev ? { ...prev, pdfUrl: url } : null);
                    }
                  }}
                  className="hidden"
                  id="pdf-upload-trigger"
                />
                <label 
                  htmlFor="pdf-upload-trigger"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-200"
                >
                  <FileText size={14} /> Bilgisayardan PDF Seç
                </label>

                {selectedItem.pdfUrl && (
                    <a 
                      href={selectedItem.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleLinkClick(e, selectedItem.pdfUrl!)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-200"
                    >
                      <FileText size={14} /> PDF'i Görüntüle
                    </a>
                )}

                {selectedItem.additionalPdfs && selectedItem.additionalPdfs.map((pdf, idx) => (
                  <a 
                    key={idx}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, pdf.url)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-amber-200"
                  >
                    <FileText size={14} /> {pdf.label}
                  </a>
                ))}
                <a 
                  href={selectedItem.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, selectedItem.officialLink)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-200"
                >
                  🌐 Mevzuat.gov.tr <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
