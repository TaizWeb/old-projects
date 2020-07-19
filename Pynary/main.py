#!/usr/bin/python3

# Python Binary Converter

# modules
import sys
import json
import os
import re

# Simeon's section
has_binary = False

__basename = os.path.basename(__file__)

binary = ""

# Tokenizer for unseparated bytes
def bintokenize(string):
	token = ""
	tlength = 0

	result = []

	while string:
		result.append(string[:8])
		string = string[8:]

	return result

# Validity checker, operates on a single byte
def bincheck(string):
	if re.match(r"[^01]", string):
		return False
	else:
		if len(list(string)) != 8:
			return False
		else:
			return True

def donothing():
	nothing = None

# Loop through arguments
for i in range(len(sys.argv)):
	if i == 0:
		donothing()
	elif sys.argv[i] == "-f":
		if has_binary:
			print(__basename + ": only one binary field allowed")
			exit(0)

		has_binary = True

		fl = sys.argv[sys.argv.index("-f") + 1]

		if os.path.isfile(fl):
			fstream = open(fl, "r")
			data = fstream.read().replace("\n", "")
			fstream.close()

			datalst = None

			for char in list(data):
				if char == " ":
					datalst = data.split(" ")

			if not datalst:
				datalst = bintokenize(data)

			for j in range(len(datalst)):
				if not bincheck(datalst[j]):
					print(__basename + ": invalid bytelength / character for ASCII in byte " + datalst[j])
					exit(0)
				else:
					binary += " " + datalst[j]
		else:
			print(__basename + ": invalid file: " + fl)
			exit(0)

		binary = binary.lstrip()

	elif not has_binary:
		data = sys.argv[i]
		datalst = None

		has_binary = True

		for char in list(data):
			if char == " ":
				datalst = data.split(" ")

		if not datalst:
			datalst = bintokenize(data)

		for j in range(len(datalst)):
			if not bincheck(datalst[j]):
				print(__basename + ": invalid bytelength / character for ASCII in byte " + datalst[j])
				exit(0)
			else:
				binary += " " + datalst[j]

		binary = binary.lstrip()

if not has_binary:
	print("Usage: " + __basename + " [options] <binary>")
	exit(0)

print(binary)

# Walter's section
json_file = open("letters.json","r+") # Opening the json file to read its contents
letters = json.loads(json_file.read()) # Loading the contents into a dict
json_file.close()

ret = ""

for byte in binary.split(" "): # Breaking everything into bytes
	bits = list(byte) # Breaking the bytes into bits
	power = 128
	num = 0

	for bit in bits:
		bit = int(bit)
		num = num + bit * power # Figuring out the dec value
		power = power / 2

	ret = ret + letters[str(int(num))] # Referencing the dec value to get it's actual form

print(ret) # Returning the completed message
