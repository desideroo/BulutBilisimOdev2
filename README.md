# C# Windows Forms Uygulamasının OpenNebula Özel Bulut Ortamına Migrasyonu

## 📄 Proje Özeti
Bu proje, yerel ortamda geliştirilen bir **C# Windows Forms** masaüstü uygulamasının, sanallaştırma teknolojileri kullanılarak oluşturulan bir **OpenNebula Özel Bulut (Private Cloud)** altyapısına taşınmasını kapsamaktadır. Proje, "Lift and Shift" yaklaşımı simüle edilerek, uygulamanın Windows tabanlı bir sanal makine (VM) üzerinde bulut ortamında çalıştırılmasını hedefler.

## 🛠 Kullanılan Teknolojiler
* **Uygulama:** C# Windows Forms (.NET Framework)
* **Sanallaştırma Platformu:** Oracle VirtualBox
* **Bulut İşletim Sistemi (Host):** Ubuntu Server 22.04 LTS
* **Bulut Yönetim Paneli:** OpenNebula
* **Guest İşletim Sistemi:** Windows 10
* **Sürücüler:** VirtIO (Windows KVM performansı için)

## Uygulama Mimari Şeması
Sistemin katmanlı mimarisi aşağıda özetlenmiştir:

[ Fiziksel Katman (Host PC) ] --> [ Sanallaştırma Katmanı (VirtualBox) ] --> [ Bulut Yönetim Nod'u (Ubuntu Linux) ] --> [ OpenNebula Frontend & KVM Hypervisor ] -->  [ Sanal Makine (Windows 10 Guest) ] --> [ C# Windows Forms Uygulaması (.exe) ]
                                                                                                                                                                   
---

## 🚀 Kurulum ve Yapılandırma Adımları

Bu proje aşağıdaki adım ve kodlar takip edilerek gerçekleştirilmiştir.

### 1. Hazırlık: VirtualBox Nested Virtualization (İç İçe Sanallaştırma) Aktivasyonu
OpenNebula'nın (KVM) Ubuntu sanal makinesi içinde başka sanal makineler çalıştırabilmesi için **Nested VT-x/AMD-V** özelliğinin aktif edilmesi gerekmektedir. Bu işlem, Ubuntu sanal makinesi **kapalıyken** Windows host makinesinde CMD (Komut İstemi) üzerinden yapılmıştır.

1.  CMD yönetici olarak çalıştırılır.
2.  VirtualBox kurulum dizinine gidilir:
    ```cmd
    cd "C:\Program Files\Oracle\VirtualBox"
    ```
3.  Nested Virtualization aktif edilir (Ubuntu sanal makine adı buraya yazılır):
    ```cmd
    VBoxManage modifyvm "OpenNebula_Sunucusu" --nested-hw-virt on
    ```

### 2. Ubuntu Üzerine OpenNebula Kurulumu
Ubuntu Server başlatıldıktan sonra, gerekli paketlerin yüklenmesi ve OpenNebula kurulumu için terminal üzerinden aşağıdaki komutlar uygulanmıştır.

**Sistem Güncellemesi ve Gerekli Araçlar:**
```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y gnupg wget curl
```

**OpenNebula Repository Ekleme ve Kurulum (MiniOne veya Repo Yöntemi):**
Bu projede OpenNebula'nın stabil sürümü kullanılmıştır.
```bash
# Repository anahtarının eklenmesi
wget -q -O- [https://downloads.opennebula.io/repo/repo.key](https://downloads.opennebula.io/repo/repo.key) | sudo apt-key add -

# Repository listesine ekleme (Ubuntu 22.04 için örnek)
echo "deb [https://downloads.opennebula.io/repo/6.4/Ubuntu/22.04](https://downloads.opennebula.io/repo/6.4/Ubuntu/22.04) stable opennebula" | sudo tee /etc/apt/sources.list.d/opennebula.list

# Paket listesini güncelleme
sudo apt-get update

# Frontend ve KVM Node paketlerinin kurulumu
sudo apt-get install -y opennebula opennebula-sunstone opennebula-gate opennebula-flow opennebula-node-kvm
```

**Servislerin Başlatılması:**
```bash
sudo systemctl start opennebula
sudo systemctl start opennebula-sunstone
sudo systemctl enable opennebula
sudo systemctl enable opennebula-sunstone
```

### 3. SSH ve Erişim Ayarları
OpenNebula yönetimi ve dosya transferi için SSH servisi aktif edilmiştir.
```bash
# SSH Servisinin durumunu kontrol etme ve başlatma
sudo systemctl status ssh
sudo systemctl enable --now ssh

# Güvenlik duvarı (UFW) kullanılıyorsa SSH izni verme
sudo ufw allow ssh
```

### 4. ISO Dosyalarının Taşınması ve Yetkilendirme (Chown/Chmod)
Windows 10 kurulumu için gerekli olan .iso dosyaları ve virtio sürücüleri /var/lib/one/ dizini altına taşınmış ve OpenNebula kullanıcısı (oneadmin) için gerekli okuma/yazma izinleri verilmiştir.

Dosyaların Taşınması: (Dosyaların indirildiği dizinden hedef dizine taşıma)
```bash
# Downloads klasöründen var klasörüne taşıma
sudo mv /home/kullaniciadi/Downloads/win10.iso /var/lib/one/
sudo mv /home/kullaniciadi/Downloads/virtio-win.iso /var/lib/one/
sudo mv /home/kullaniciadi/Downloads/one-context.iso /var/lib/one/
```

Kritik Adım: Dosya Sahipliği ve İzinler (Permission): OpenNebula'nın dosyaları görebilmesi için dosyaların sahibi oneadmin yapılmalıdır.
```bash
# Sahipliği oneadmin kullanıcısına ve grubuna verme
sudo chown -R oneadmin:oneadmin /var/lib/one/

# Dosya izinlerini ayarlama (Okuma/Yazma)
sudo chmod -R 775 /var/lib/one/
```

### 5. OpenNebula Arayüz (Sunstone) Girişi
Kurulum tamamlandıktan sonra, oneadmin kullanıcısının şifresi alınarak tarayıcıdan giriş yapılmıştır.

Giriş Bilgilerini Öğrenme:
```bash
# oneadmin kullanıcısının otomatik oluşturulan şifresini görüntüleme
sudo cat /var/lib/one/.one/one_auth
```

-URL: https://<UBUNTU_IP_ADRESI>:9869
-Kullanıcı: oneadmin
-Şifre: (Yukarıdaki komut çıktısındaki şifre)

### 💻 Sanal Makine (VM) Oluşturma Süreci
1. Images: Yukarıda yetki verilen ISO dosyaları OpenNebula panelinde "Images" bölümüne "OS" ve "CDROM" tiplerinde eklendi.

2. Datablock: 45 GB boyutunda boş bir Datablock imajı oluşturuldu (C: Sürücüsü olarak).

3. Templates: CPU ve RAM kaynakları belirlenerek VM şablonu oluşturuldu. Disk sıralaması:

    -Datablock (Target: vda)
    -Win10 ISO (Target: hdb)
    -VirtIO ISO (Target: hdc)
    -One-Context ISO (Target: hdd)

4. Instantiate: Şablon kullanılarak VM ayağa kaldırıldı.
