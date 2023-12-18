<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Rules\RutCheck;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use Tymon\JWTAuth\Contracts\Providers\JWT;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/login",D
     *     summary="Iniciar sesión y obtener un token JWT.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="password", type="string"),
     *         )
     *     ),
     *     @OA\Response(response="200", description="Inicio de sesión exitoso. Se devuelve un token JWT."),
     *     @OA\Response(response="400", description="Credenciales inválidas. Esto puede suceder si la contraseña es incorrecta."),
     *     @OA\Response(response="404", description="Usuario no encontrado. No existe un usuario con el nombre proporcionado."),
     *     @OA\Response(response="500", description="Error de token. Problema al generar o manejar el token JWT."),
     * )
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // Intentar generar un token JWT con las credenciales proporcionadas.
            if (!$token = JWTAuth::attempt($credentials)) {
                // Comprueba si el usuario con ese nombre existe.
                $user = User::where('email', $request->email)->first();
                if ($user) {
                    // El usuario existe, pero la contraseña es incorrecta.
                    return response()->json([
                        'error' => 'Credenciales inválidas.'
                    ], 400);
                } else {
                    // El usuario no existe.
                    return response()->json([
                        'error' => 'Usuario no encontrado.'
                    ], 404);
                }
            }
            // Obtiene el usuario asociado al token JWT.
            $user = JWTAuth::user();

        } catch (JWTException $e) {
            return response()->json([
                'error' => 'Error de token.'
            ], 500);
        }

        return response()->json(compact('token'));
    }

    /**
     * @OA\Post(
     *     path="/api/auth/register",
     *     summary="Registrar un nuevo usuario y obtener un token JWT.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="last_name", type="string"),
     *             @OA\Property(property="dni", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *         )
     *     ),
     *     @OA\Response(response="200", description="Registro exitoso. Se devuelve un token JWT."),
     *     @OA\Response(response="400", description="Datos inválidos o usuario ya existe."),
     * )
     */
    public function register(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                'regex:/@(ucn\.cl|alumnos\.ucn\.cl|disc\.ucn\.cl|ce\.ucn\.cl)$/i'
            ],
            'dni' => [
                'required',
                'string',
                'max:255',
                'unique:users',
                new RutCheck(),
            ],
            'full_name' => 'required|string|min:10|max:150',
            'birthday' => 'required|date|after:1899-12-31|before_or_equal:now',
            'password' => 'required|string',
        ]);

        // Crear el usuario
        $user = User::create([
            'email' => $validatedData['email'],
            'dni' => $validatedData['dni'],
            'full_name' => $validatedData['full_name'],
            'birthday' => $validatedData['birthday'],
            'password' => bcrypt($validatedData['password']),
        ]);

        // Generar un token JWT para el usuario
        $token = JWTAuth::fromUser($user);

        // Devolver una respuesta JSON con el token
        return response()->json(compact('token'));
    }


    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="Cerrar sesión y invalidar el token JWT actual.",
     *     @OA\Response(response="200", description="Cierre de sesión exitoso."),
     *     @OA\Response(response="500", description="Fallo al cerrar sesión."),
     * )
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            // Invalida el token JWT actual.
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Cierre de sesión exitoso.']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Fallo al cerrar sesión.'], 500);
        }
    }
    /**
     * @OA\Put(
     *     path="/api/auth/change-password",
     *     summary="Cambiar la contraseña de un usuario.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="current_password", type="string"),
     *             @OA\Property(property="new_password", type="string"),
     *             @OA\Property(property="new_password_confirmation", type="string")
     *         )
     *     ),
     *     @OA\Response(response="200", description="Contraseña cambiada con éxito."),
     *     @OA\Response(response="400", description="Datos inválidos o contraseña actual incorrecta."),
     *     @OA\Response(response="500", description="Error del servidor."),
     * )
     */
    public function changePassword(Request $request)
    {
        // Validar datos de entrada
        $validatedData = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = JWTAuth::user();

        // Verificar la contraseña actual
        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json(['error' => 'La contraseña actual es incorrecta'], 400);
        }

        // Actualizar la contraseña
        $user->password = bcrypt($validatedData['new_password']);
        $user->save();

        return response()->json(['message' => 'Contraseña cambiada con éxito']);
    }

    /**
     * @OA\Put(
     *     path="/api/auth/update-profile",
     *     summary="Actualizar la información del perfil del usuario.",
     *     description="Permite a los usuarios autenticados actualizar su nombre completo, correo electrónico y año de nacimiento.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="full_name", type="string", example="Juan Perez"),
     *             @OA\Property(property="email", type="string", format="email", example="juan.perez@ucn.cl"),
     *             @OA\Property(property="birthday", type="string", format="date", example="1990-01-01")
     *         )
     *     ),
     *     @OA\Response(response="200", description="Perfil actualizado con éxito."),
     *     @OA\Response(response="400", description="Datos inválidos."),
     *     @OA\Response(response="401", description="No autorizado."),
     *     @OA\Response(response="500", description="Error del servidor."),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function updateProfile(Request $request)
    {
        $user = JWTAuth::user();

        // Validar los datos de entrada
        $validatedData = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes', 'required', 'string', 'email', 'max:255',
                'unique:users,email,' . $user->id,
                'regex:/@(ucn\.cl|alumnos\.ucn\.cl|disc\.ucn\.cl|ce\.ucn\.cl)$/i'
            ],
            'birthday' => 'sometimes|required|date|before_or_equal:now',
        ]);

        // Actualizar la información del usuario
        $user->fill($validatedData);
        $user->save();

        return response()->json(['message' => 'Perfil actualizado con éxito']);
    }

}
