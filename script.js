function tambahBaris() {
  const container = document.getElementById("dynamicNameContainer");

  const newRow = document.createElement("div");
  // Menambahkan class 'slide-in' agar terpicu animasi CSS
  newRow.className = "input-row slide-in";

  newRow.innerHTML = `
        <input type="text" class="nama-input" placeholder="Contoh: Jane Smith">
        <button class="btn-icon btn-remove" onclick="hapusBaris(this)">-</button>
    `;

  container.appendChild(newRow);
}

function hapusBaris(tombol) {
  const row = tombol.parentElement;
  // Beri efek transisi menghilang sebelum benar-benar dihapus dari HTML
  row.style.opacity = "0";
  row.style.transform = "translateY(-10px)";
  row.style.transition = "all 0.3s ease";

  setTimeout(() => {
    row.remove();
  }, 300); // Hapus elemen setelah 300ms (menunggu animasi selesai)
}

function sortirLog() {
  const btn = document.querySelector(".btn-sortir");
  const originalText = btn.innerText;
  btn.innerText = "Memproses..."; // Efek UX saat tombol diklik

  // Memberi sedikit delay visual agar terlihat seperti ada proses komputasi
  setTimeout(() => {
    const rawText = document.getElementById("inputLog").value;
    const hapusTimestamp = document.getElementById("hapusTimestamp").checked;
    const hanyaIC = document.getElementById("hanyaIC").checked;
    const hapusWarna = document.getElementById("hapusWarna").checked;

    const inputElements = document.querySelectorAll(".nama-input");
    let namaArray = [];

    inputElements.forEach((input) => {
      const val = input.value.trim().toLowerCase();
      if (val !== "") {
        namaArray.push(val);
      }
    });

    const lines = rawText.split("\n");
    let hasil = [];

    for (let line of lines) {
            if (!line.trim()) continue;

            // Buat salinan teks tanpa timestamp khusus untuk dianalisis
            // (Agar pengecekan tanda bintang (*) tidak terhalang oleh [HH:MM:SS])
            let textToAnalyze = line.replace(/\[\d{2}:\d{2}:\d{2}\]\s*/g, '').trim();

            // Logika baru untuk Filter OOC
            if (hanyaIC && textToAnalyze.includes('((') && textToAnalyze.includes('))')) {
                // Jika TIDAK diawali dengan bintang (*), berarti ini murni chat OOC (misal: /b atau PM). Kita buang.
                // Jika diawali bintang (*), berarti ini adalah /do, jadi kita biarkan lolos.
                if (!textToAnalyze.startsWith('*')) {
                    continue; 
                }
            }

            // Filter Pesan Server
            if (line.startsWith('***') || line.startsWith('SERVER:')) continue;

            // Logika Pengecekan Multiple Nama
            if (namaArray.length > 0) {
                let textLower = line.toLowerCase();
                let matchDitemukan = false;
                
                for (let nama of namaArray) {
                    if (textLower.includes(nama)) {
                        matchDitemukan = true;
                        break; 
                    }
                }
                if (!matchDitemukan) continue;
            }

            // Pembersihan Warna Hex
            if (hapusWarna) {
                line = line.replace(/\{[a-fA-F0-9]{6}\}/g, '');
            }

            // Pembersihan Timestamp di hasil akhir (jika dicentang)
            if (hapusTimestamp) {
                line = line.replace(/\[\d{2}:\d{2}:\d{2}\]\s*/g, '');
            }

            hasil.push(line);
        }

    document.getElementById("outputLog").value = hasil.join("\n");
    btn.innerText = originalText; // Kembalikan teks tombol
  }, 200);
}

// Fungsi untuk menyalin teks ke Clipboard
async function copyLog() {
  const copyText = document.getElementById("outputLog").value;
  const copyBtn = document.getElementById("copyBtn");

  // Jika textarea masih kosong, jangan lakukan apa-apa
  if (!copyText.trim()) {
    alert("Tidak ada teks yang bisa disalin!");
    return;
  }

  try {
    // Proses menyalin teks
    await navigator.clipboard.writeText(copyText);

    // Simpan teks asli tombol
    const originalText = copyBtn.innerText;

    // Ubah tampilan tombol menjadi sukses (Warna Hijau)
    copyBtn.innerText = "Copied! ✅";
    copyBtn.style.background = "rgba(16, 185, 129, 0.2)";
    copyBtn.style.color = "#10b981";
    copyBtn.style.borderColor = "#10b981";

    // Kembalikan tombol seperti semula setelah 2 detik
    setTimeout(() => {
      copyBtn.innerText = originalText;
      copyBtn.style.background = "";
      copyBtn.style.color = "";
      copyBtn.style.borderColor = "";
    }, 2000);
  } catch (err) {
    alert(
      "Gagal menyalin teks. Browser Anda mungkin tidak mendukung fitur ini.",
    );
  }
}
