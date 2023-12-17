<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class RutCheck implements Rule
{
    /**
     * Determina si el valor de validación pasa la regla.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Eliminar puntos y guión
        $rut = str_replace(['.', '-'], '', $value);

        // Obtener dígito verificador y número del RUT
        $dv = strtolower(substr($rut, -1));
        $numbers = substr($rut, 0, -1);

        // Invertir y multiplicar por la secuencia 2, 3, 4, 5, 6, 7
        $sequence = [2, 3, 4, 5, 6, 7];
        $sum = 0;
        $seqIndex = 0;
        for ($i = strlen($numbers) - 1; $i >= 0; $i--) {
            $sum += $numbers[$i] * $sequence[$seqIndex];
            $seqIndex = $seqIndex < 5 ? $seqIndex + 1 : 0;
        }

        // Calcular el dígito verificador
        $calculatedDv = 11 - ($sum % 11);
        $calculatedDv = $calculatedDv == 11 ? 0 : ($calculatedDv == 10 ? 'k' : $calculatedDv);

        // Comparar con el dígito verificador proporcionado
        return $calculatedDv == $dv;
    }

    /**
     * Obtener el mensaje de error de validación.
     *
     * @return string
     */
    public function message()
    {
        return 'El dígito verificador del RUT no es válido.';
    }
}
