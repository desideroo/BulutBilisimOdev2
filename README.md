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
