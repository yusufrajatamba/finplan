import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  User,
  Heart,
  Home,
  MapPin,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Users,
  Award,
  ArrowRight,
  Plus,
  X,
  UserPlus,
} from "lucide-react";

interface StepDataDiriProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onNext: () => void;
  onAddNewProfile?: () => void;
}

const COMMON_SKILLS = [
  "Software Engineering",
  "Product Management",
  "Digital Marketing",
  "Finance & Accounting",
  "UI/UX Design",
  "Sales & Negosiasi",
  "Data Analytics",
  "Manajemen Bisnis & Operasional",
  "Kuliner & F&B",
  "Pendidikan & Training",
  "Medis & Kesehatan",
  "Hukum & Legal",
];

const COMMON_INTERESTS = [
  "Investasi Saham & Pasar Modal",
  "Bisnis & Kewirausahaan",
  "Properti & Real Estate",
  "Otomotif & Kendaraan",
  "Parenting & Edukasi Anak",
  "Travelling & Liburan",
  "Olahraga & Kebugaran",
  "Teknologi & Gadget",
  "Fotografi & Konten Kreatif",
];

export const StepDataDiri: React.FC<StepDataDiriProps> = ({
  profile,
  onChange,
  onNext,
  onAddNewProfile,
}) => {
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customInterestInput, setCustomInterestInput] = useState("");

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleToggleSkill = (skill: string) => {
    const current = profile.skillsAndTalents || [];
    if (current.includes(skill)) {
      handleFieldChange(
        "skillsAndTalents",
        current.filter((s) => s !== skill)
      );
    } else {
      handleFieldChange("skillsAndTalents", [...current, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !(profile.skillsAndTalents || []).includes(customSkillInput.trim())) {
      handleFieldChange("skillsAndTalents", [...(profile.skillsAndTalents || []), customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const handleToggleInterest = (interest: string) => {
    const current = profile.interestsAndHobbies || [];
    if (current.includes(interest)) {
      handleFieldChange(
        "interestsAndHobbies",
        current.filter((i) => i !== interest)
      );
    } else {
      handleFieldChange("interestsAndHobbies", [...current, interest]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterestInput.trim() && !(profile.interestsAndHobbies || []).includes(customInterestInput.trim())) {
      handleFieldChange("interestsAndHobbies", [...(profile.interestsAndHobbies || []), customInterestInput.trim()]);
      setCustomInterestInput("");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Langkah 1 dari 8 • Profiling Lengkap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Informasi Data Diri & Rencana Kehidupan
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Data pribadi, rencana domisili, kemampuan, dan kondisi kesehatan Anda menjadi fondasi vital bagi AI untuk menghitung kebutuhan proteksi jiwa, pos anggaran tempat tinggal, dan kapasitas earning power.
          </p>
        </div>

        {onAddNewProfile && (
          <div className="shrink-0 flex items-center">
            <button
              onClick={onAddNewProfile}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 shadow-sm transition-all cursor-pointer"
              title="Buat profil baru untuk orang yang berbeda"
            >
              <UserPlus className="w-4 h-4 text-emerald-200" />
              <span>+ Profil Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Identitas & Keluarga */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Identitas & Status Keluarga</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Profil demografi dasar</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Lengkap / Panggilan
              </label>
              <input
                type="text"
                value={profile.fullName || ""}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                placeholder="Contoh: Dimas Suryo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Jenis Kelamin
                </label>
                <select
                  value={profile.gender || "Laki-laki"}
                  onChange={(e) => handleFieldChange("gender", e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Usia Saat Ini (Tahun)
                </label>
                <input
                  type="number"
                  min="17"
                  max="75"
                  value={profile.age || ""}
                  onChange={(e) => handleFieldChange("age", parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Status Pernikahan
                </label>
                <select
                  value={profile.maritalStatus || "Lajang"}
                  onChange={(e) => handleFieldChange("maritalStatus", e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Lajang">Lajang (Single)</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Pernah Menikah">Pernah Menikah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Jumlah Tanggungan
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={profile.dependents ?? 0}
                  onChange={(e) => handleFieldChange("dependents", parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="0 jika belum ada anak/ortu"
                />
                <p className="text-[11px] text-slate-400 mt-1">Anak, pasangan tidak bekerja, atau orang tua</p>
              </div>
            </div>

            {profile.maritalStatus === "Menikah" && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                  <span>Data Pasangan (Suami / Istri)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Nama Pasangan
                    </label>
                    <input
                      type="text"
                      value={profile.partnerName || ""}
                      onChange={(e) => handleFieldChange("partnerName", e.target.value)}
                      placeholder="Nama Pasangan"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Usia Pasangan
                    </label>
                    <input
                      type="number"
                      value={profile.partnerAge || ""}
                      onChange={(e) => handleFieldChange("partnerAge", parseInt(e.target.value) || 0)}
                      placeholder="Usia"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Status Tinggal: Serumah vs LDM */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Kondisi Domisili Bersama Pasangan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFieldChange("isLDM", false)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer text-center ${
                        !profile.isLDM
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      🏠 Tinggal Serumah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange("isLDM", true)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer text-center ${
                        profile.isLDM
                          ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      ✈️ Sedang LDM (Beda Kota)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Tempat Tinggal & Rencana Domisili */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Tempat Tinggal & Domisili</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kondisi saat ini & rencana hunian masa depan</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Kota / Kabupaten Tempat Tinggal Saat Ini
              </label>
              <input
                type="text"
                value={profile.currentCity || ""}
                onChange={(e) => handleFieldChange("currentCity", e.target.value)}
                placeholder="Contoh: Jakarta Selatan, Surabaya, Bandung"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Rencana Domisili Jangka Panjang (5-10 Tahun ke Depan)
              </label>
              <input
                type="text"
                value={profile.domicilePlan || ""}
                onChange={(e) => handleFieldChange("domicilePlan", e.target.value)}
                placeholder="Contoh: Tetap di Jakarta / Pindah ke BSD Serpong / Pulang ke Jogja"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status Tempat Tinggal Saat Ini
              </label>
              <select
                value={profile.housingStatus || "kos"}
                onChange={(e) => handleFieldChange("housingStatus", e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="rumah_sendiri">Rumah Sendiri (Lunas / Warisan)</option>
                <option value="kpr_berjalan">Rumah Sendiri (Sedang Cicil KPR)</option>
                <option value="sewa_kontrakan">Sewa Rumah / Kontrakan</option>
                <option value="kos">Kos / Sewa Kamar</option>
                <option value="tinggal_bersama_ortu">Tinggal Bersama Orang Tua / Mertua</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Rencana Tempat Tinggal Ke Depan
              </label>
              <input
                type="text"
                value={profile.housingPlan || ""}
                onChange={(e) => handleFieldChange("housingPlan", e.target.value)}
                placeholder="Contoh: Beli Rumah Baru KPR dalam 3 tahun / Renovasi Rumah Ortu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Kemampuan, Bakat & Minat */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Kemampuan, Bakat & Minat</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Potensi penghasilan sampingan & passion</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Keahlian & Kemampuan Utama (Pilih yang sesuai)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_SKILLS.map((skill) => {
                  const isSelected = (profile.skillsAndTalents || []).includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill Form */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Tambah keahlian lain..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-medium hover:bg-indigo-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bakat & Minat / Hobi
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_INTERESTS.map((interest) => {
                  const isSelected = (profile.interestsAndHobbies || []).includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleAddCustomInterest} className="flex gap-2">
                <input
                  type="text"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  placeholder="Tambah minat lain..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-medium hover:bg-purple-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Card 4: Kondisi Kesehatan & Proteksi */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Kondisi Kesehatan & Proteksi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analisis risiko kesehatan & asuransi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status Kondisi Kesehatan Umum
              </label>
              <select
                value={profile.healthCondition || "Prima (Sangat Sehat)"}
                onChange={(e) => handleFieldChange("healthCondition", e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Prima (Sangat Sehat)">Prima (Sangat Sehat, Tanpa Riwayat Kronis)</option>
                <option value="Sehat dengan Catatan Ringan">Sehat dengan Catatan Ringan (Alergi / Maag / Mata Minus)</option>
                <option value="Ada Riwayat Penyakit Tertentu">Ada Riwayat Penyakit Khusus / Penyakit Kritis Keluarga</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status BPJS Kesehatan (JKN)
              </label>
              <select
                value={profile.bpjsStatus || "Aktif (Kelas 1 / Standar)"}
                onChange={(e) => handleFieldChange("bpjsStatus", e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Aktif (Kelas 1 / Standar)">Aktif (Kelas 1 / Ditanggung Perusahaan / PPU)</option>
                <option value="Aktif (Kelas 2 / 3)">Aktif (Kelas 2 / 3 Mandiri)</option>
                <option value="Belum Aktif">Belum Aktif / Ada Tunggakan</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={!!profile.hasPrivateInsurance}
                  onChange={(e) => handleFieldChange("hasPrivateInsurance", e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Memiliki Asuransi Kesehatan / Jiwa Swasta Tambahan
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Centang jika Anda sudah memiliki polis asuransi swasta mandiri (rawat inap murni / asuransi jiwa term-life).
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Tingkat Pemahaman Finansial & Investasi
              </label>
              <select
                value={profile.financialKnowledge || "pemula"}
                onChange={(e) => handleFieldChange("financialKnowledge", e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="pemula">Pemula (Baru mulai menabung & belajar instrumen)</option>
                <option value="menengah">Menengah (Paham reksadana, SBN, saham & risiko pasar)</option>
                <option value="mahir">Mahir (Aktif menyusun portofolio saham, properti & diversifikasi luas)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 2: Profile Keuangan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
