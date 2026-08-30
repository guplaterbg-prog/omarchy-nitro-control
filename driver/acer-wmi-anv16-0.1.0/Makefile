KERNELRELEASE ?= $(shell uname -r)
KERNEL_DIR ?= /usr/lib/modules/$(KERNELRELEASE)/build

obj-m := acer-wmi.o

.PHONY: all clean

all:
	$(MAKE) -C $(KERNEL_DIR) M=$(CURDIR) modules

clean:
	$(MAKE) -C $(KERNEL_DIR) M=$(CURDIR) clean
