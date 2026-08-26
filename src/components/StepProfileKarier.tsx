import React from "react";
import { CareerProfile, SingleCareerProfile } from "../types";
import {
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Building2,
  MapPin,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
} from "lucide-react";

interface StepProfileKarierProps {
  career: CareerProfile;
  onChange: (updated: CareerProfile) => void;
  onNext: () => void;
  onPrev: () => void;
  hasPartner: boolean;
}

const JOB_TYPES = [
  "Karyawan Swasta",
  "PNS / ASN / Pegawai BUMN",
  "Wirausaha / Pemilik Bisnis",
  "Freelancer / Konsultan Profesional",
  "Dokter / Tenaga Medis",
  "Pengacara / Legal",
  "TNI / Polri",
  "Ibu Rumah Tangga",
  "Fresh Graduate / Sedang Mencari Kerja",
  "Lainnya",
];

const PROMOTION_POTENTIALS = [
  "Tinggi (1-2 tahun ke depan)",
  "Sedang (3-5 tahun ke depan)",
  "Stabil / Terbatas",
];

export const StepProfileKarier: React.FC<StepProfileKarierProps> = ({
  career,
  onChange,
  onNext,
  onPrev,
  hasPartner,
}) => {
  const handlePersonalChange = (field: keyof SingleCareerProfile, value: any) => {
    onChange({
      ...career,
      personal: {
        ...career.personal,
        [field]: value,
      },
    });
  };

  const handlePartnerChange = (field: keyof SingleCareerProfile, value: any) => {
    onChange({
      ...career,
      partner: {
        ...(career.partner || {
          jobType: "Karyawan Swasta",
          companyField: "",
          officeLocation: "",
          careerGoal: "",
          layoffRisk: "Rendah",
          layoffMitigation: "",
          salaryGrowthRatePercent: 7,
          promotionPotential: "Sedang (3-5 tahun ke depan)",
        }),
        [field]: value,
      },
    });
  };

  const handleTogglePartner = (checked: boolean) => {
    onChange({
      ...career,
      hasPartnerCareer: checked,
      partner: checked
        ? career.partner || {
            jobType: "Karyawan Swasta",
            companyField: "",
            officeLocation: "",
            careerGoal: "",
            layoffRisk: "Rendah",
            layoffMitigation: "",
            salaryGrowthRatePercent: 7,
            promotionPotential: "Sedang (3-5 tahun ke depan)",
          }
        : undefined,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#0099FF] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-300/40 space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold border border-white/30 text-white">
          <Briefcase className="w-3.5 h-3.5 text-blue-100" />
          <span>Langkah 3 dari 7 • Stabilitas & Prospek Karier</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Profil Karier & Pertumbuhan Penghasilan
        </h1>
        <p className="text-blue-50 text-xs sm:text-sm leading-relaxed max-w-4xl">
          Evaluasi stabilitas pekerjaan, potensi kenaikan penghasilan, dan mitigasi risiko pendapatan untuk memproyeksikan earning power jangka panjang.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Karier Pribadi (Suami / User) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#003399] dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Profil Karier Pribadi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Data pekerjaan & rencana pertumbuhan karier Anda</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Jenis Pekerjaan / Profesi
              </label>
              <select
                value={career.personal?.jobType || "Karyawan Swasta"}
                onChange={(e) => handlePersonalChange("jobType", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Bidang Industri / Sektor Kantor
                </label>
                <input
                  type="text"
                  value={career.personal?.companyField || ""}
                  onChange={(e) => handlePersonalChange("companyField", e.target.value)}
                  placeholder="Contoh: IT & Software, Perbankan, F&B"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Lokasi Kantor / Tempat Usaha
                </label>
                <input
                  type="text"
                  value={career.personal?.officeLocation || ""}
                  onChange={(e) => handlePersonalChange("officeLocation", e.target.value)}
                  placeholder="Contoh: SCBD Jakarta, WFH, Surabaya"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Rencana & Target Karier Jangka Menengah
              </label>
              <input
                type="text"
                value={career.personal?.careerGoal || ""}
                onChange={(e) => handlePersonalChange("careerGoal", e.target.value)}
                placeholder="Contoh: Promosi ke level Manager / Rintis Agensi / Ekspansi 2 Cabang"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Potensi Risiko PHK / Downturn
                </label>
                <select
                  value={career.personal?.layoffRisk || "Sedang"}
                  onChange={(e) => handlePersonalChange("layoffRisk", e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                >
                  <option value="Rendah">Rendah (Sangat Aman / PNS / BUMN)</option>
                  <option value="Sedang">Sedang (Perusahaan Stabil)</option>
                  <option value="Tinggi">Tinggi (Startup / Sektor Fluktuatif)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Potensi Naik Jabatan
                </label>
                <select
                  value={career.personal?.promotionPotential || "Sedang (3-5 tahun ke depan)"}
                  onChange={(e) => handlePersonalChange("promotionPotential", e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                >
                  {PROMOTION_POTENTIALS.map((pot) => (
                    <option key={pot} value={pot}>
                      {pot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Estimasi Kenaikan Gaji Tahunan (%)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={career.personal?.salaryGrowthRatePercent ?? 7}
                    onChange={(e) => handlePersonalChange("salaryGrowthRatePercent", parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">% / tahun (Rata-rata inflasi + merit)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Strategi Mitigasi Risiko
                </label>
                <input
                  type="text"
                  value={career.personal?.layoffMitigation || ""}
                  onChange={(e) => handlePersonalChange("layoffMitigation", e.target.value)}
                  placeholder="Contoh: Upskilling AI, perbanyak relasi klien"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Karier Pasangan (Istri / Pasangan) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Profile Karier Pasangan</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pekerjaan & stabilitas penghasilan pasangan</p>
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!career.hasPartnerCareer}
                onChange={(e) => handleTogglePartner(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Ada Pasangan Bekerja
              </span>
            </label>
          </div>

          {career.hasPartnerCareer ? (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Jenis Pekerjaan Pasangan
                </label>
                <select
                  value={career.partner?.jobType || "Karyawan Swasta"}
                  onChange={(e) => handlePartnerChange("jobType", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Bidang Industri / Sektor Pasangan
                  </label>
                  <input
                    type="text"
                    value={career.partner?.companyField || ""}
                    onChange={(e) => handlePartnerChange("companyField", e.target.value)}
                    placeholder="Contoh: Digital Agency, Rumah Sakit"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Lokasi Kantor Pasangan
                  </label>
                  <input
                    type="text"
                    value={career.partner?.officeLocation || ""}
                    onChange={(e) => handlePartnerChange("officeLocation", e.target.value)}
                    placeholder="Contoh: Jakarta Pusat, WFH"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Rencana Karier Pasangan
                </label>
                <input
                  type="text"
                  value={career.partner?.careerGoal || ""}
                  onChange={(e) => handlePartnerChange("careerGoal", e.target.value)}
                  placeholder="Contoh: Pertahankan stabilitas, buka usaha kuliner rumahan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Potensi Risiko PHK Pasangan
                  </label>
                  <select
                    value={career.partner?.layoffRisk || "Rendah"}
                    onChange={(e) => handlePartnerChange("layoffRisk", e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Rendah">Rendah (Sangat Aman)</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Estimasi Kenaikan Gaji Pasangan (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={career.partner?.salaryGrowthRatePercent ?? 7}
                      onChange={(e) => handlePartnerChange("salaryGrowthRatePercent", parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold text-center"
                    />
                    <span className="text-[11px] text-slate-500">% / thn</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Karier pasangan saat ini dinonaktifkan.
              </p>
              <p className="text-[11px] text-slate-400">
                Jika Anda lajang atau pasangan fokus sebagai ibu/bapak rumah tangga penuh waktu, Anda dapat melanjutkan dengan satu sumber karier utama.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Arus Kas</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#0066CC] hover:bg-[#0055B8] text-white font-bold text-sm shadow-md hover:scale-[1.01] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 4: Target Goals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
