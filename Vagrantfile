Vagrant.configure("2") do |config|

  # set ssh options
  config.ssh.forward_agent = true
  config.ssh.forward_x11 = true

  # set vm options
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.hostname = "dev"
  config.vm.box_check_update = false
  config.vm.synced_folder ".", "/vagrant"
  config.vm.network "private_network", ip: "192.168.33.10"

  # set vm provider
  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = "1024"
    vb.name = "cannon-dev"
  end

  # set vm provioner
  config.vm.provision "ansible_local" do |ansible|
      ansible.provisioning_path = "/vagrant/provisioning/"
      ansible.playbook = "playbook.yml"
      ansible.install = true
  end

end
